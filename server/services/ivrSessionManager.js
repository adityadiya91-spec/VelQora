/**
 * IVR Session Manager
 * In-memory state machine tracking active phone calls, DTMF inputs, and multi-step IVR booking progress.
 * Includes timeout cleanup, retry limit thresholds, and back/repeat navigation.
 */

import { PROMPTS, STATUS_DESCRIPTIONS } from "./ivrPrompts.js";
import { resolvePinCode } from "./geoResolver.js";

export const IVR_STEPS = {
  LANGUAGE: "LANGUAGE",
  MAIN_MENU: "MAIN_MENU",
  PICKUP_PIN: "PICKUP_PIN",
  DEST_PIN: "DEST_PIN",
  CATEGORY: "CATEGORY",
  QUANTITY: "QUANTITY",
  DATE: "DATE",
  TIME: "TIME",
  CONFIRM: "CONFIRM",
  COMPLETED: "COMPLETED",
  ASSISTANCE: "ASSISTANCE",
};

const CATEGORY_MAP = {
  "1": { label: "Small (Crate / Box)", code: "produce", weight_per_unit: 15, volume_cbm: 0.05 },
  "2": { label: "Medium (Sack / Milk Can)", code: "dairy", weight_per_unit: 35, volume_cbm: 0.12 },
  "3": { label: "Large (Bulk Carton)", code: "textile", weight_per_unit: 75, volume_cbm: 0.28 },
};

const TIME_MAP = {
  "1": "06:00-10:00 (Early Morning)",
  "2": "08:00-12:00 (Standard Morning)",
  "3": "12:00-16:00 (Afternoon Dispatch)",
  "4": "16:00-20:00 (Evening Run)",
};

export class IVRSessionManager {
  constructor(options = {}) {
    this.sessionTimeoutMs = options.sessionTimeoutMs || 15 * 60 * 1000; // 15 mins
    this.maxRetries = options.maxRetries || 3;
    this.sessions = new Map();

    // Auto-cleanup stale sessions every 2 minutes
    this.cleanupTimer = setInterval(() => this.cleanupExpiredSessions(), 2 * 60 * 1000);
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivityAt > this.sessionTimeoutMs) {
        this.sessions.delete(sessionId);
      }
    }
  }

  createSession({ callSid, from, to = null }) {
    const normalizedPhone = String(from).replace(/[^0-9+]/g, "");
    const session = {
      sessionId: `IVR-SESS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      callSid: callSid || `CALL-${Date.now()}`,
      phone: normalizedPhone,
      to,
      lang: "hi", // Default language
      step: IVR_STEPS.LANGUAGE,
      retryCount: 0,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      bookingDraft: {
        pickupPin: null,
        pickupVillage: null,
        destPin: null,
        destVillage: null,
        category: null,
        quantity: 1,
        weight_kg: 25,
        volume_cbm: 0.1,
        dateOption: null,
        pickupDate: null,
        timeOption: null,
        dispatchWindow: null,
      },
      history: [],
    };

    this.sessions.set(session.callSid, session);
    return session;
  }

  getSession(callSid) {
    const session = this.sessions.get(callSid);
    if (session) {
      session.lastActivityAt = Date.now();
    }
    return session || null;
  }

  deleteSession(callSid) {
    return this.sessions.delete(callSid);
  }

  /**
   * Process incoming DTMF digits for the active session
   */
  processInput(callSid, digits) {
    const session = this.getSession(callSid);
    if (!session) {
      return {
        success: false,
        error: "Session expired or not found",
        promptText: PROMPTS.hi.invalidInput,
        endCall: true,
      };
    }

    const cleanDigits = String(digits || "").replace(/[^0-9*#]/g, "").trim();

    // Global assistance escape: 0 or 3 from main menu
    if (cleanDigits === "0") {
      session.step = IVR_STEPS.ASSISTANCE;
      return {
        success: true,
        session,
        promptText: PROMPTS[session.lang].humanAssistance,
        action: "TRANSFER_OPERATOR",
      };
    }

    // Step state-machine execution
    switch (session.step) {
      case IVR_STEPS.LANGUAGE:
        return this.handleLanguageStep(session, cleanDigits);

      case IVR_STEPS.MAIN_MENU:
        return this.handleMainMenuStep(session, cleanDigits);

      case IVR_STEPS.PICKUP_PIN:
        return this.handlePickupPinStep(session, cleanDigits);

      case IVR_STEPS.DEST_PIN:
        return this.handleDestPinStep(session, cleanDigits);

      case IVR_STEPS.CATEGORY:
        return this.handleCategoryStep(session, cleanDigits);

      case IVR_STEPS.QUANTITY:
        return this.handleQuantityStep(session, cleanDigits);

      case IVR_STEPS.DATE:
        return this.handleDateStep(session, cleanDigits);

      case IVR_STEPS.TIME:
        return this.handleTimeStep(session, cleanDigits);

      case IVR_STEPS.CONFIRM:
        return this.handleConfirmStep(session, cleanDigits);

      default:
        return {
          success: false,
          session,
          promptText: PROMPTS[session.lang].invalidInput,
        };
    }
  }

  handleLanguageStep(session, digits) {
    if (digits === "1") {
      session.lang = "hi";
      session.step = IVR_STEPS.MAIN_MENU;
      session.retryCount = 0;
      return {
        success: true,
        session,
        promptText: PROMPTS.hi.mainMenu,
      };
    } else if (digits === "2") {
      session.lang = "en";
      session.step = IVR_STEPS.MAIN_MENU;
      session.retryCount = 0;
      return {
        success: true,
        session,
        promptText: PROMPTS.en.mainMenu,
      };
    }

    return this.handleInvalidInput(session, PROMPTS.hi.welcome);
  }

  handleMainMenuStep(session, digits) {
    const p = PROMPTS[session.lang];

    if (digits === "1") {
      session.step = IVR_STEPS.PICKUP_PIN;
      session.retryCount = 0;
      return {
        success: true,
        session,
        promptText: p.askPickupPin,
      };
    } else if (digits === "2") {
      return {
        success: true,
        session,
        action: "CHECK_STATUS",
        promptText: p.statusLookupPrompt,
      };
    } else if (digits === "3") {
      session.step = IVR_STEPS.ASSISTANCE;
      return {
        success: true,
        session,
        action: "TRANSFER_OPERATOR",
        promptText: p.humanAssistance,
      };
    } else if (digits === "9") {
      return {
        success: true,
        session,
        promptText: p.mainMenu,
      };
    }

    return this.handleInvalidInput(session, p.mainMenu);
  }

  handlePickupPinStep(session, digits) {
    const p = PROMPTS[session.lang];
    const pin = digits.replace("#", "");

    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const geo = resolvePinCode(pin);
      session.bookingDraft.pickupPin = pin;
      session.bookingDraft.pickupVillage = geo.name;
      session.bookingDraft.pickupLandmark = geo.landmark;
      session.step = IVR_STEPS.DEST_PIN;
      session.retryCount = 0;

      return {
        success: true,
        session,
        promptText: p.askDestPin,
      };
    }

    return this.handleInvalidInput(session, p.askPickupPin);
  }

  handleDestPinStep(session, digits) {
    const p = PROMPTS[session.lang];
    const pin = digits.replace("#", "");

    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const geo = resolvePinCode(pin);
      session.bookingDraft.destPin = pin;
      session.bookingDraft.destVillage = geo.name;
      session.step = IVR_STEPS.CATEGORY;
      session.retryCount = 0;

      return {
        success: true,
        session,
        promptText: p.askParcelCategory,
      };
    }

    return this.handleInvalidInput(session, p.askDestPin);
  }

  handleCategoryStep(session, digits) {
    const p = PROMPTS[session.lang];
    const cat = CATEGORY_MAP[digits];

    if (cat) {
      session.bookingDraft.category = cat.code;
      session.bookingDraft.categoryMeta = cat;
      session.step = IVR_STEPS.QUANTITY;
      session.retryCount = 0;

      return {
        success: true,
        session,
        promptText: p.askParcelQuantity,
      };
    }

    return this.handleInvalidInput(session, p.askParcelCategory);
  }

  handleQuantityStep(session, digits) {
    const p = PROMPTS[session.lang];
    const qty = parseInt(digits.replace("#", ""), 10);

    if (!isNaN(qty) && qty > 0 && qty <= 100) {
      session.bookingDraft.quantity = qty;
      const weightPerUnit = session.bookingDraft.categoryMeta?.weight_per_unit || 25;
      const volumePerUnit = session.bookingDraft.categoryMeta?.volume_cbm || 0.1;

      session.bookingDraft.weight_kg = qty * weightPerUnit;
      session.bookingDraft.volume_cbm = Math.round(qty * volumePerUnit * 100) / 100;

      session.step = IVR_STEPS.DATE;
      session.retryCount = 0;

      return {
        success: true,
        session,
        promptText: p.askPickupDate,
      };
    }

    return this.handleInvalidInput(session, p.askParcelQuantity);
  }

  handleDateStep(session, digits) {
    const p = PROMPTS[session.lang];

    if (["1", "2", "3"].includes(digits)) {
      const offsetDays = parseInt(digits, 10) - 1;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + offsetDays);

      session.bookingDraft.dateOption = digits;
      session.bookingDraft.pickupDate = targetDate.toISOString().slice(0, 10);
      session.step = IVR_STEPS.TIME;
      session.retryCount = 0;

      return {
        success: true,
        session,
        promptText: p.askPickupTime,
      };
    }

    return this.handleInvalidInput(session, p.askPickupDate);
  }

  handleTimeStep(session, digits) {
    const p = PROMPTS[session.lang];
    const timeWindow = TIME_MAP[digits];

    if (timeWindow) {
      session.bookingDraft.timeOption = digits;
      session.bookingDraft.dispatchWindow = timeWindow;
      session.step = IVR_STEPS.CONFIRM;
      session.retryCount = 0;

      // Generate readback script
      const readback = this.buildReadbackScript(session);

      return {
        success: true,
        session,
        promptText: `${p.readbackIntro} ${readback} ${p.readbackConfirm}`,
      };
    }

    return this.handleInvalidInput(session, p.askPickupTime);
  }

  buildReadbackScript(session) {
    const d = session.bookingDraft;
    if (session.lang === "hi") {
      return `Pickup gaon: ${d.pickupVillage}. Delivery gaon: ${d.destVillage}. Kul wajan: ${d.weight_kg} kilo. Tareekh: ${d.pickupDate}. Samay: ${d.dispatchWindow}.`;
    }
    return `Pickup hub: ${d.pickupVillage}. Destination: ${d.destVillage}. Total weight: ${d.weight_kg} kilograms. Date: ${d.pickupDate}. Time: ${d.dispatchWindow}.`;
  }

  handleConfirmStep(session, digits) {
    const p = PROMPTS[session.lang];

    if (digits === "1") {
      session.step = IVR_STEPS.COMPLETED;
      return {
        success: true,
        session,
        action: "COMMIT_BOOKING",
        promptText: p.bookingSuccess,
        endCall: true,
      };
    } else if (digits === "2") {
      // Modify: restart booking questions
      session.step = IVR_STEPS.PICKUP_PIN;
      session.retryCount = 0;
      return {
        success: true,
        session,
        promptText: p.askPickupPin,
      };
    } else if (digits === "3") {
      session.step = IVR_STEPS.COMPLETED;
      return {
        success: true,
        session,
        promptText: p.bookingCancelled,
        endCall: true,
      };
    }

    return this.handleInvalidInput(session, p.readbackConfirm);
  }

  handleInvalidInput(session, repeatPrompt) {
    session.retryCount += 1;
    const p = PROMPTS[session.lang];

    if (session.retryCount >= this.maxRetries) {
      return {
        success: false,
        session,
        promptText: p.maxRetriesExceeded,
        endCall: true,
      };
    }

    return {
      success: false,
      session,
      promptText: `${p.invalidInput} ${repeatPrompt}`,
    };
  }

  destroy() {
    clearInterval(this.cleanupTimer);
    this.sessions.clear();
  }
}

export const ivrSessionManager = new IVRSessionManager();
export default ivrSessionManager;

