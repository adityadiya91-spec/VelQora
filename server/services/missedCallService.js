/**
 * Missed Call & Automated Callback Service
 * Tracks incoming rings, enforces cooldown to prevent loop spam,
 * and schedules automated callbacks for rural keypad users.
 */

export class MissedCallService {
  constructor(options = {}) {
    this.cooldownMinutes = options.cooldownMinutes || 10;
    this.maxDailyAttempts = options.maxDailyAttempts || 5;
    this.callLog = new Map(); // phone -> { lastAttempt, attemptsToday, date }
  }

  normalizePhone(phone) {
    if (!phone) return "";
    let clean = String(phone).replace(/[^0-9]/g, "");
    if (clean.length === 10) {
      clean = "91" + clean;
    }
    return "+" + clean;
  }

  isEligibleForCallback(phone) {
    const norm = this.normalizePhone(phone);
    if (!norm || norm.length < 11) {
      return { eligible: false, reason: "INVALID_PHONE" };
    }

    const record = this.callLog.get(norm);
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10);

    if (!record) {
      return { eligible: true };
    }

    // Reset daily counter if new day
    if (record.date !== todayStr) {
      record.attemptsToday = 0;
      record.date = todayStr;
    }

    // Daily limit check
    if (record.attemptsToday >= this.maxDailyAttempts) {
      return { eligible: false, reason: "DAILY_LIMIT_EXCEEDED" };
    }

    // Cooldown check
    const elapsedMinutes = (now - record.lastAttempt) / (1000 * 60);
    if (elapsedMinutes < this.cooldownMinutes) {
      const waitRemaining = Math.ceil(this.cooldownMinutes - elapsedMinutes);
      return {
        eligible: false,
        reason: "COOLDOWN_ACTIVE",
        waitMinutes: waitRemaining,
      };
    }

    return { eligible: true };
  }

  recordCallbackAttempt(phone) {
    const norm = this.normalizePhone(phone);
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10);

    const existing = this.callLog.get(norm) || {
      attemptsToday: 0,
      date: todayStr,
    };

    if (existing.date !== todayStr) {
      existing.attemptsToday = 0;
      existing.date = todayStr;
    }

    existing.attemptsToday += 1;
    existing.lastAttempt = now;
    this.callLog.set(norm, existing);

    return existing;
  }

  clearRecord(phone) {
    const norm = this.normalizePhone(phone);
    this.callLog.delete(norm);
  }
}

export const missedCallService = new MissedCallService({
  cooldownMinutes: parseInt(process.env.VOICE_CALLBACK_COOLDOWN_MINUTES || "10", 10),
});

export default missedCallService;

