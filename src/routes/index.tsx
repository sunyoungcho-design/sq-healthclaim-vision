import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame, StatusBar } from "@/components/sq/PhoneFrame";
import { ChevronLeft, CreditCard, Check, Wifi, Apple } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Square Health — Modern healthcare payments" },
      { name: "description", content: "A clean, modern healthcare claims and payment prototype in Square design language." },
    ],
  }),
  component: Index,
});

type Step = "scan" | "verify" | "summary" | "approve" | "tap" | "done";

function Index() {
  const [step, setStep] = useState<Step>("scan");

  return (
    <PhoneFrame>
      <div className="sq-screen" key={step}>
        <StatusBar />
        <div className="flex-1 flex flex-col sq-fadein">
          {step === "scan" && <Scan onNext={() => setStep("verify")} />}
          {step === "verify" && <Verify onDone={() => setStep("summary")} />}
          {step === "summary" && <Summary onNext={() => setStep("approve")} onBack={() => setStep("scan")} />}
          {step === "approve" && <Approve onApprove={() => setStep("tap")} onDecline={() => setStep("scan")} onBack={() => setStep("summary")} />}
          {step === "tap" && <Tap onPaid={() => setStep("done")} onBack={() => setStep("approve")} />}
          {step === "done" && <Done onDone={() => setStep("scan")} />}
        </div>
      </div>
    </PhoneFrame>
  );
}

function TopBar({ onBack, title }: { onBack?: () => void; title?: string }) {
  return (
    <div className="px-4 h-12 flex items-center">
      {onBack ? (
        <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-[var(--sq-surface)] transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : <div className="w-10 h-10" />}
      <div className="flex-1 text-center text-[15px] font-semibold">{title}</div>
      <div className="w-10 h-10" />
    </div>
  );
}

/* ---------------- 1. SCAN ---------------- */
function Scan({ onNext }: { onNext: () => void }) {
  return (
    <>
      <TopBar />
      <div className="px-7 pt-4">
        <h1 className="sq-h1">Check your coverage</h1>
        <p className="sq-sub mt-2">Scan or tap your healthcare card to continue.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-7">
        <div className="relative w-[260px] h-[260px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--sq-surface)]" />
          <div className="sq-pulse-ring" style={{ animationDelay: "0s" }} />
          <div className="sq-pulse-ring" style={{ animationDelay: ".6s" }} />
          <div className="sq-pulse-ring" style={{ animationDelay: "1.2s" }} />

          <div className="relative w-[180px] h-[112px] rounded-2xl bg-white border border-[var(--sq-line)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-widest text-[var(--sq-muted)]">HEALTH</div>
              <Wifi className="w-3.5 h-3.5 rotate-90 text-[var(--sq-ink)]" />
            </div>
            <div>
              <div className="h-1.5 w-20 rounded-full bg-[var(--sq-line)] mb-1.5" />
              <div className="h-1.5 w-12 rounded-full bg-[var(--sq-line)]" />
            </div>
            <div className="flex justify-between items-end">
              <div className="text-[9px] font-medium tracking-wider text-[var(--sq-ink-2)]">MEMBER</div>
              <div className="text-[9px] font-mono text-[var(--sq-muted)]">•••• 4821</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-7 pb-2 text-center">
        <p className="text-[13px] text-[var(--sq-muted)]">Hold card near the top of your device</p>
      </div>

      <div className="px-6 pt-4">
        <button onClick={onNext} className="sq-btn sq-btn-primary">Start</button>
      </div>

      <div className="px-6 pt-5 pb-6">
        <div className="text-center text-[10px] tracking-[0.18em] font-semibold text-[var(--sq-muted)] mb-3">
          ACCEPTED IN AUSTRALIA
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {["Medicare", "Bupa", "Medibank", "HCF", "nib", "AHM", "HBF"].map((b) => (
            <span
              key={b}
              className="px-2.5 h-6 inline-flex items-center rounded-full border border-[var(--sq-line)] bg-white text-[11px] font-semibold tracking-tight text-[var(--sq-ink-2)]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- 2. VERIFY ---------------- */
function Verify({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--sq-line)] border-t-[var(--sq-ink)] animate-spin" />
        <h2 className="mt-8 text-[20px] font-semibold tracking-tight">Checking insurance eligibility…</h2>
        <p className="mt-2 sq-sub">This may take a few seconds.</p>
        <div className="sq-bar w-40 mt-8"><i /></div>
      </div>
      <div className="pb-10 text-center text-[12px] text-[var(--sq-muted)]">Secured by Square</div>
    </>
  );
}

/* ---------------- 3. SUMMARY ---------------- */
function Summary({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <>
      <TopBar onBack={onBack} title="Treatment Summary" />
      <div className="px-6 pt-2">
        <div className="sq-card p-5">
          <div className="text-[12px] font-medium text-[var(--sq-muted)] uppercase tracking-wider">Clinic</div>
          <div className="text-[17px] font-semibold mt-0.5">Riverside Family Dental</div>
          <div className="mt-4 sq-row">
            <div>
              <div className="text-[12px] text-[var(--sq-muted)]">Practitioner</div>
              <div className="text-[15px] font-medium mt-0.5">Dr. Amelia Chen</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-[var(--sq-muted)]">Visit</div>
              <div className="text-[15px] font-medium mt-0.5">Today, 2:30 PM</div>
            </div>
          </div>
        </div>

        <div className="sq-card mt-4 p-5">
          <div className="sq-row">
            <span className="text-[15px]">Treatment</span>
            <span className="text-[15px] font-medium">Routine Cleaning</span>
          </div>
          <div className="sq-divider my-4" />
          <div className="space-y-3.5">
            <Line label="Treatment Total" value="$220.00" />
            <Line label="Insurance Covers" value="−$160.00" muted />
          </div>
          <div className="sq-divider my-4" />
          <div className="sq-row">
            <span className="text-[15px] font-semibold">You Pay Today</span>
            <span className="text-[28px] font-semibold tracking-tight">$60.00</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--sq-muted)] px-1">
          <Check className="w-3.5 h-3.5" />
          Eligibility verified with BlueCross • Plan PPO 2400
        </div>
      </div>

      <div className="flex-1" />
      <div className="px-6 pb-8 pt-6">
        <button onClick={onNext} className="sq-btn sq-btn-primary">Continue</button>
      </div>
    </>
  );
}

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="sq-row">
      <span className={`text-[15px] ${muted ? "text-[var(--sq-muted)]" : ""}`}>{label}</span>
      <span className={`text-[15px] ${muted ? "text-[var(--sq-muted)]" : "font-medium"}`}>{value}</span>
    </div>
  );
}

/* ---------------- 4. APPROVE ---------------- */
function Approve({ onApprove, onDecline, onBack }: { onApprove: () => void; onDecline: () => void; onBack: () => void }) {
  return (
    <>
      <TopBar onBack={onBack} title="Review Payment" />
      <div className="px-7 pt-6">
        <div className="text-[14px] text-[var(--sq-muted)]">Amount due today</div>
        <div className="mt-1 text-[56px] leading-none font-semibold tracking-tight">$60<span className="text-[28px] text-[var(--sq-muted)] align-top">.00</span></div>
        <p className="sq-sub mt-3">Your insurance covered part of today's treatment.</p>
      </div>

      <div className="px-6 mt-8">
        <div className="sq-card p-5 space-y-3.5">
          <Line label="Treatment Total" value="$220.00" />
          <Line label="Insurance Covered" value="−$160.00" muted />
          <div className="sq-divider" />
          <div className="sq-row">
            <span className="text-[15px] font-semibold">Remaining Balance</span>
            <span className="text-[17px] font-semibold">$60.00</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="px-6 pb-8 pt-6 space-y-2">
        <button onClick={onApprove} className="sq-btn sq-btn-primary">Approve Payment</button>
        <button onClick={onDecline} className="sq-btn sq-btn-ghost">Decline</button>
      </div>
    </>
  );
}

/* ---------------- 5. TAP TO PAY ---------------- */
function Tap({ onPaid, onBack }: { onPaid: () => void; onBack: () => void }) {
  useEffect(() => {
    const t = setTimeout(onPaid, 3200);
    return () => clearTimeout(t);
  }, [onPaid]);

  return (
    <>
      <TopBar onBack={onBack} title="Tap to Pay" />
      <div className="px-7 pt-6 text-center">
        <div className="text-[13px] uppercase tracking-[0.18em] text-[var(--sq-muted)] font-semibold">Amount Due</div>
        <div className="mt-2 text-[64px] leading-none font-semibold tracking-tight">$60<span className="text-[32px] text-[var(--sq-muted)] align-top">.00</span></div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[240px] h-[240px] flex items-center justify-center">
          <div className="sq-pulse-ring" style={{ animationDelay: "0s" }} />
          <div className="sq-pulse-ring" style={{ animationDelay: ".7s" }} />
          <div className="sq-pulse-ring" style={{ animationDelay: "1.4s" }} />
          <div className="w-[120px] h-[120px] rounded-full bg-[var(--sq-ink)] flex items-center justify-center">
            <Wifi className="w-12 h-12 text-white rotate-90" />
          </div>
        </div>
      </div>

      <div className="px-7 pb-8 text-center">
        <div className="text-[18px] font-semibold">Ready to Pay</div>
        <p className="sq-sub mt-1.5">Hold your card or device near the top.</p>
        <div className="mt-6 flex items-center justify-center gap-3 text-[var(--sq-ink-2)]">
          <Apple className="w-5 h-5" />
          <span className="w-px h-4 bg-[var(--sq-line)]" />
          <CreditCard className="w-5 h-5" />
          <span className="text-[12px] font-medium tracking-wider text-[var(--sq-muted)]">CONTACTLESS</span>
        </div>
      </div>
    </>
  );
}

/* ---------------- 6. DONE ---------------- */
function Done({ onDone }: { onDone: () => void }) {
  return (
    <>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <div className="sq-check">
          <Check className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <h2 className="mt-7 text-[26px] font-semibold tracking-tight">Payment Complete</h2>
        <p className="sq-sub mt-2">Your receipt has been recorded.</p>

        <div className="sq-card mt-8 p-5 w-full text-left space-y-3.5">
          <Line label="Paid Today" value="$60.00" />
          <Line label="Insurance Covered" value="$160.00" muted />
          <div className="sq-divider" />
          <div className="sq-row">
            <span className="text-[13px] text-[var(--sq-muted)]">Confirmation</span>
            <span className="text-[13px] font-mono">SQ-8F2A-4821</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-6 space-y-2">
        <button onClick={onDone} className="sq-btn sq-btn-primary">Done</button>
        <button className="sq-btn sq-btn-ghost">Email Receipt</button>
      </div>
    </>
  );
}
