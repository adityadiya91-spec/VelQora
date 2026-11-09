/**
 * KarWan Voice Telephony Backend API Server
 * Built with standard Node.js HTTP module (Zero extra dependencies required).
 * Exposes all REST endpoints for Exotel webhooks, missed-call handling, and IVR execution.
 */

import http from "node:http";
import url from "node:url";
import { ivrSessionManager } from "./services/ivrSessionManager.js";
import { missedCallService } from "./services/missedCallService.js";
import { exotelService } from "./services/exotelService.js";
import { voiceBookingBridge } from "./services/voiceBookingBridge.js";
import { PROMPTS, STATUS_DESCRIPTIONS } from "./services/ivrPrompts.js";

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        const parsed = {};
        new URLSearchParams(body).forEach((val, key) => {
          parsed[key] = val;
        });
        resolve(parsed);
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function handleVoiceRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();
  const query = parsedUrl.query || {};

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // 1. GET /api/voice/health
  if (method === "GET" && pathname === "/api/voice/health") {
    return sendJson(res, 200, {
      status: "healthy",
      service: "KarWan Telephony Voice Module",
      provider: exotelService.isMockMode() ? "mock" : "exotel",
      timestamp: new Date().toISOString(),
    });
  }

  // 2. GET /api/voice/booking-status
  if (method === "GET" && pathname === "/api/voice/booking-status") {
    const phone = query.phone;
    if (!phone) {
      return sendJson(res, 400, { error: "Phone number required" });
    }
    const bookings = voiceBookingBridge.getBookingsByPhone(phone);
    return sendJson(res, 200, {
      success: true,
      phone,
      count: bookings.length,
      bookings,
    });
  }

  // POST Request Handlers
  if (method === "POST") {
    parseBody(req).then(async (body) => {
      const mergedPayload = { ...query, ...body };

      // POST /api/voice/incoming
      if (pathname === "/api/voice/incoming") {
        if (!exotelService.verifyWebhook({ body: mergedPayload, query })) {
          return sendJson(res, 403, { error: "Unauthorized webhook origin" });
        }
        const from = mergedPayload.From || mergedPayload.CallFrom || "+919822012345";
        const callSid = mergedPayload.CallSid || `CALL-${Date.now()}`;
        const session = ivrSessionManager.createSession({ callSid, from });
        const initialPrompt = PROMPTS[session.lang].welcome;

        return sendJson(res, 200, {
          success: true,
          callSid: session.callSid,
          step: session.step,
          promptText: initialPrompt,
          exotelResponse: exotelService.formatAppletResponse({ text: initialPrompt }),
        });
      }

      // POST /api/voice/missed-call
      if (pathname === "/api/voice/missed-call") {
        if (!exotelService.verifyWebhook({ body: mergedPayload, query })) {
          return sendJson(res, 403, { error: "Unauthorized webhook origin" });
        }
        const phone = mergedPayload.From || mergedPayload.phone;
        if (!phone) {
          return sendJson(res, 400, { error: "Phone number required" });
        }

        const eligibility = missedCallService.isEligibleForCallback(phone);
        if (!eligibility.eligible) {
          return sendJson(res, 429, {
            success: false,
            reason: eligibility.reason,
            message:
              eligibility.reason === "COOLDOWN_ACTIVE"
                ? `Callback already scheduled. Please wait ${eligibility.waitMinutes} minute(s).`
                : "Callback limit reached for today.",
          });
        }

        missedCallService.recordCallbackAttempt(phone);
        const callbackResult = await exotelService.initiateCallback({ to: phone });

        return sendJson(res, 200, {
          success: true,
          phone,
          callbackResult,
          message: "Missed call registered. Outbound IVR callback dispatched.",
        });
      }

      // POST /api/voice/callback
      if (pathname === "/api/voice/callback") {
        const phone = mergedPayload.phone;
        if (!phone) {
          return sendJson(res, 400, { error: "Phone number required" });
        }
        const result = await exotelService.initiateCallback({ to: phone });
        return sendJson(res, 200, result);
      }

      // POST /api/voice/ivr/input
      if (pathname === "/api/voice/ivr/input") {
        if (!exotelService.verifyWebhook({ body: mergedPayload, query })) {
          return sendJson(res, 403, { error: "Unauthorized webhook origin" });
        }
        const callSid = mergedPayload.CallSid;
        const digits = mergedPayload.Digits || mergedPayload.digits;

        if (!callSid) {
          return sendJson(res, 400, { error: "CallSid required" });
        }

        const result = ivrSessionManager.processInput(callSid, digits);

        if (result.action === "COMMIT_BOOKING") {
          const createdBooking = voiceBookingBridge.createBookingFromIVR(result.session);
          return sendJson(res, 200, {
            success: true,
            booking: createdBooking,
            promptText: result.promptText,
            endCall: true,
          });
        }

        if (result.action === "CHECK_STATUS") {
          const activeBookings = voiceBookingBridge.getBookingsByPhone(result.session.phone);
          const p = PROMPTS[result.session.lang];

          if (activeBookings.length === 0) {
            return sendJson(res, 200, {
              success: true,
              promptText: p.noActiveBookings,
              endCall: true,
            });
          }

          const latest = activeBookings[0];
          const desc = STATUS_DESCRIPTIONS[result.session.lang][latest.status] || latest.status;
          const statusText = p.statusReport
            .replace("{trackingId}", latest.tracking_id)
            .replace("{statusText}", desc)
            .replace("{pickup}", latest.pickup_village)
            .replace("{destination}", latest.destination);

          return sendJson(res, 200, {
            success: true,
            booking: latest,
            promptText: statusText,
            endCall: true,
          });
        }

        if (result.action === "TRANSFER_OPERATOR") {
          const helpReq = voiceBookingBridge.logAssistanceRequest({
            phone: result.session.phone,
            callSid,
          });
          return sendJson(res, 200, {
            success: true,
            action: "TRANSFER_OPERATOR",
            transferTo: exotelService.operatorNumber || "8655123452",
            assistanceRequest: helpReq,
            promptText: result.promptText,
            endCall: false,
            exotelResponse: exotelService.formatAppletResponse({
              text: result.promptText,
              transferNumber: exotelService.operatorNumber || "8655123452",
            }),
          });
        }

        return sendJson(res, 200, {
          success: result.success,
          step: result.session?.step,
          promptText: result.promptText,
          endCall: result.endCall || false,
          exotelResponse: exotelService.formatAppletResponse({
            text: result.promptText,
            endCall: result.endCall,
          }),
        });
      }

      // POST /api/voice/booking
      if (pathname === "/api/voice/booking") {
        const session = mergedPayload.session;
        if (!session || !session.bookingDraft) {
          return sendJson(res, 400, { error: "Valid IVR session data required" });
        }
        const booking = voiceBookingBridge.createBookingFromIVR(session);
        return sendJson(res, 200, { success: true, booking });
      }

      // POST /api/voice/status
      if (pathname === "/api/voice/status") {
        const callSid = mergedPayload.CallSid;
        const status = mergedPayload.Status || mergedPayload.CallStatus || "completed";
        if (callSid) {
          ivrSessionManager.deleteSession(callSid);
        }
        return sendJson(res, 200, { success: true, callSid, status });
      }

      // POST /api/voice/human-assistance
      if (pathname === "/api/voice/human-assistance") {
        const phone = mergedPayload.phone;
        const reason = mergedPayload.reason;
        if (!phone) {
          return sendJson(res, 400, { error: "Phone number required" });
        }
        const helpReq = voiceBookingBridge.logAssistanceRequest({ phone, reason });
        return sendJson(res, 200, {
          success: true,
          message: "Human operator assistance request logged successfully",
          request: helpReq,
        });
      }

      sendJson(res, 404, { error: "Endpoint not found" });
    });
    return;
  }

  sendJson(res, 404, { error: "Route not found" });
}

export function startVoiceServer(port = 4000) {
  const server = http.createServer(handleVoiceRequest);
  server.listen(port, () => {
    console.info(`[KarWan Telephony] Voice Webhook Server listening on port ${port}`);
  });
  return server;
}

export default {
  handleVoiceRequest,
  startVoiceServer,
};
