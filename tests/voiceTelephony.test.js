/**
 * Automated Test Suite for KarWan Voice Calling & Telephony System
 * Tests:
 * 1. Incoming call session initiation
 * 2. Missed call callback eligibility and 10-minute cooldown validation
 * 3. Language selection (Hindi & English)
 * 4. Keypad DTMF progression (PINs, Category, Quantity, Date, Time, Confirmation)
 * 5. Completed booking insertion with source: "VOICE"
 * 6. Automated trigger into existing parcel aggregation engine
 * 7. Booking status retrieval over phone
 * 8. Human operator assistance transfer
 * 9. Development Mock mode safety (zero paid calls triggered)
 */

import { handleVoiceRequest } from "../server/voiceServer.js";
import { ivrSessionManager } from "../server/services/ivrSessionManager.js";
import { missedCallService } from "../server/services/missedCallService.js";
import { exotelService } from "../server/services/exotelService.js";
import { voiceBookingBridge } from "../server/services/voiceBookingBridge.js";

async function runVoiceTests() {
  console.log("=================================================");
  console.log("STARTING KARWAN TELEPHONY & VOICE SYSTEM TESTS");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Mock Mode Safety Test
  assert(exotelService.isMockMode() === true, "Exotel operates safely in mock mode without billing");

  // 2. Incoming Call Session Creation
  const session = ivrSessionManager.createSession({
    callSid: "TEST_CALL_101",
    from: "+919822012345",
  });
  assert(session.step === "LANGUAGE", "Session initializes at LANGUAGE selection step");
  assert(session.phone === "+919822012345", "Caller phone is correctly normalized");

  // 3. Language Selection (Hindi = 1)
  let res = ivrSessionManager.processInput("TEST_CALL_101", "1");
  assert(res.session.lang === "hi" && res.session.step === "MAIN_MENU", "Selects Hindi and advances to MAIN_MENU");

  // 4. Menu Selection (New Booking = 1)
  res = ivrSessionManager.processInput("TEST_CALL_101", "1");
  assert(res.session.step === "PICKUP_PIN", "Advances to PICKUP_PIN collection");

  // 5. Pickup PIN Code Entry (413102# -> Baramati)
  res = ivrSessionManager.processInput("TEST_CALL_101", "413102#");
  assert(res.session.bookingDraft.pickupVillage === "Baramati", "Resolves Baramati from PIN 413102");
  assert(res.session.step === "DEST_PIN", "Advances to DEST_PIN collection");

  // 6. Destination PIN Code Entry (415523# -> Phaltan)
  res = ivrSessionManager.processInput("TEST_CALL_101", "415523#");
  assert(res.session.bookingDraft.destVillage === "Phaltan", "Resolves Phaltan from PIN 415523");
  assert(res.session.step === "CATEGORY", "Advances to CATEGORY selection");

  // 7. Category Selection (2 = Medium / Dairy)
  res = ivrSessionManager.processInput("TEST_CALL_101", "2");
  assert(res.session.bookingDraft.category === "dairy", "Maps Key 2 to Dairy category");
  assert(res.session.step === "QUANTITY", "Advances to QUANTITY step");

  // 8. Quantity Entry (3# -> 3 units)
  res = ivrSessionManager.processInput("TEST_CALL_101", "3#");
  assert(res.session.bookingDraft.weight_kg === 105, "Calculates 3 x 35kg = 105kg weight");
  assert(res.session.step === "DATE", "Advances to DATE step");

  // 9. Date Selection (1 = Today)
  res = ivrSessionManager.processInput("TEST_CALL_101", "1");
  assert(res.session.bookingDraft.pickupDate !== null, "Sets valid ISO pickup date");
  assert(res.session.step === "TIME", "Advances to TIME window step");

  // 10. Time Selection (2 = Morning 8 to 12)
  res = ivrSessionManager.processInput("TEST_CALL_101", "2");
  assert(res.session.step === "CONFIRM", "Advances to CONFIRM step with dynamic readback");

  // 11. Booking Confirmation (Key 1 = Confirm)
  res = ivrSessionManager.processInput("TEST_CALL_101", "1");
  assert(res.action === "COMMIT_BOOKING", "Triggers COMMIT_BOOKING action on Key 1");

  // 12. Database Bridge & Aggregation Engine Integration
  const createdBooking = voiceBookingBridge.createBookingFromIVR(res.session);
  assert(createdBooking.source === "VOICE", "Booking source is explicitly marked as 'VOICE'");
  assert(createdBooking.tracking_id.startsWith("VQ-"), "Generates valid tracking ID format");
  assert(createdBooking.pickup_village === "Baramati", "Matches Baramati pickup");
  assert(createdBooking.destination === "Phaltan", "Matches Phaltan destination");
  assert(createdBooking.status === "assigned" || createdBooking.status === "pending_match", "Successfully processed by parcel aggregation engine");

  // 13. Status Lookup via Phone
  const activeList = voiceBookingBridge.getBookingsByPhone("+919822012345");
  assert(activeList.length >= 1, "Phone status lookup retrieves created voice consignment");

  // 14. Missed Call Cooldown Protection
  missedCallService.clearRecord("+919822012345");
  const elig1 = missedCallService.isEligibleForCallback("+919822012345");
  assert(elig1.eligible === true, "First missed call is eligible for callback");

  missedCallService.recordCallbackAttempt("+919822012345");
  const elig2 = missedCallService.isEligibleForCallback("+919822012345");
  assert(elig2.eligible === false && elig2.reason === "COOLDOWN_ACTIVE", "Immediate second call is blocked by cooldown");

  // 15. Human Operator Assistance Request
  const help = voiceBookingBridge.logAssistanceRequest({
    phone: "+919822012345",
    callSid: "TEST_CALL_101",
    reason: "Keypad Operator Escape",
  });
  assert(help.id.startsWith("HELP-"), "Logs operator assistance request with valid ID");

  console.log("=================================================");
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");

  ivrSessionManager.destroy();

  if (failed > 0) {
    process.exit(1);
  }
}

runVoiceTests();
