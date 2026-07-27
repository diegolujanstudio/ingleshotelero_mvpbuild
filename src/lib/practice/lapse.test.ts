import { describe, it, expect } from "vitest";
import {
  planPracticeSession,
  daysBetween,
  NORMAL_DUE_CARDS,
  RECOVERY_FLOOR_CARDS,
} from "./lapse";

const AT = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

describe("daysBetween", () => {
  it("counts whole calendar days, ignoring time of day", () => {
    expect(daysBetween(new Date("2026-07-01T23:59:00Z"), new Date("2026-07-02T00:01:00Z"))).toBe(1);
    expect(daysBetween(new Date("2026-07-01T00:00:00Z"), new Date("2026-07-01T23:59:00Z"))).toBe(0);
  });
});

describe("planPracticeSession", () => {
  it("treats a brand new learner as normal, not as a lapse", () => {
    const p = planPracticeSession(null, 0, AT("2026-07-10"));
    expect(p.posture).toBe("normal");
    expect(p.dueCardCount).toBe(NORMAL_DUE_CARDS);
    expect(p.showReturnWelcome).toBe(false);
  });

  it("keeps a same-day repeat at a normal load", () => {
    const p = planPracticeSession("2026-07-10", 0, AT("2026-07-10"));
    expect(p.posture).toBe("normal");
    expect(p.daysSinceLastPractice).toBe(0);
  });

  it("does NOT punish a 2-day gap — that is ordinary shift work", () => {
    const p = planPracticeSession("2026-07-08", 0, AT("2026-07-10"));
    expect(p.posture).toBe("normal");
    expect(p.dueCardCount).toBe(NORMAL_DUE_CARDS);
    expect(p.showReturnWelcome).toBe(false);
  });

  it("enters recovery at 3 days and serves the floor, not the backlog", () => {
    const p = planPracticeSession("2026-07-07", 0, AT("2026-07-10"));
    expect(p.posture).toBe("returning");
    expect(p.dueCardCount).toBe(RECOVERY_FLOOR_CARDS);
    expect(p.showReturnWelcome).toBe(true);
  });

  it("serves the SAME tiny load after a very long absence", () => {
    // The whole point of Law 5: a 6-month lapse must not produce a pile.
    const long = planPracticeSession("2026-01-10", 0, AT("2026-07-10"));
    const short = planPracticeSession("2026-07-07", 0, AT("2026-07-10"));
    expect(long.dueCardCount).toBe(short.dueCardCount);
    expect(long.dueCardCount).toBe(RECOVERY_FLOOR_CARDS);
  });

  it("ramps back up one item per completed session", () => {
    const at = AT("2026-07-10");
    expect(planPracticeSession("2026-07-01", 0, at).dueCardCount).toBe(1);
    expect(planPracticeSession("2026-07-01", 1, at).dueCardCount).toBe(2);
    expect(planPracticeSession("2026-07-01", 2, at).dueCardCount).toBe(3);
  });

  it("never exceeds the normal load while ramping", () => {
    const p = planPracticeSession("2026-07-01", 99, AT("2026-07-10"));
    expect(p.dueCardCount).toBe(NORMAL_DUE_CARDS);
  });

  it("greets only on the first session back, not for the whole ramp", () => {
    const at = AT("2026-07-10");
    expect(planPracticeSession("2026-07-01", 0, at).showReturnWelcome).toBe(true);
    expect(planPracticeSession("2026-07-01", 1, at).showReturnWelcome).toBe(false);
  });

  it("falls back to normal on an unparseable date rather than throwing", () => {
    const p = planPracticeSession("not-a-date", 0, AT("2026-07-10"));
    expect(p.posture).toBe("normal");
    expect(p.dueCardCount).toBe(NORMAL_DUE_CARDS);
  });
});
