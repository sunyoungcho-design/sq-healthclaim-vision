import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame, StatusBar } from "@/components/sq/PhoneFrame";
import { ChevronLeft, CreditCard, Check, Wifi, Apple } from "lucide-react";
import nibLogo from "@/assets/insurers/nib.png";
import medibankLogo from "@/assets/insurers/medibank.png";
import hcfLogo from "@/assets/insurers/hcf.avif";
import healthpointLogo from "@/assets/insurers/healthpoint.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Square Health — Modern healthcare payments" },
      { name: "description", content: "A clean, modern healthcare claims and payment prototype in Square design language." },
    ],
  }),
  component: Index,
});

type Step = "scan" | "verify" | "summary" | "tap" | "done";

function Index() {
  const [step, setStep] = useState<Step>("scan");
  const [amount, setAmount] = useState<number>(60);

  return (
    <PhoneFrame>
      <div className="sq-screen" key={step}>
        <StatusBar />
        <div className="flex-1 min-h-0 flex flex-col sq-fadein">
          {step === "scan" && <Scan onNext={() => setStep("verify")} />}
          {step === "verify" && <Verify onDone={() => setStep("summary")} />}
          {step === "summary" && (
            <Summary
              onAccept={() => { setAmount(60); setStep("tap"); }}
              onReject={() => { setAmount(220); setStep("tap"); }}
              onBack={() => setStep("scan")}
            />
          )}
          {step === "tap" && <Tap amount={amount} onPaid={() => setStep("done")} onBack={() => setStep("summary")} />}
          {step === "done" && <Done amount={amount} selfClaim={amount === 220} onDone={() => { setAmount(60); setStep("scan"); }} />}
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
const MORE_BRANDS = [
  "Australian Unity", "Bupa", "HBF", "AHM", "UniHealth", "RBHS",
  "CBHS", "Mildura Health", "Teachers Health", "GMHBA", "Budget Direct",
  "HIF", "Doctors Health", "Defence Health", "GU Health", "health.com.au",
  "Latrobe", "Frank", "Westfund", "CUA Health", "RT Health", "ACA Health",
  "Peoplecare", "TUH", "Police Health", "St Lukes", "Onemedifund",
  "Healthcare Insurance", "Queensland Country", "Navy Health",
  "Phoenix Health", "Health Partners", "Qantas Insurance", "Apia",
  "Emergency Services", "Nurses & Midwives", "Hunter Health",
  "myOwn", "Suncorp", "AAMI",
];

function Scan({ onNext }: { onNext: () => void }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <TopBar />
      <div className="px-6 pt-2 text-center">
        <h1 className="sq-h1">Check your cover</h1>
        <h1 className="sq-h1">Insert, swipe or tap</h1>
        <h1 className="sq-h1">health card</h1>
      </div>

      <div className="flex items-center justify-center px-6 pt-4">
        <button
          onClick={onNext}
          aria-label="Tap to scan health card"
          className="group relative w-[220px] h-[220px] flex items-center justify-center focus:outline-none"
        >
          <div className="absolute inset-0 rounded-full bg-[#ebebeb]/[0.18]" />
          <div className="absolute inset-4 rounded-full border border-[var(--sq-line)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
          <div className="relative w-[150px] h-[94px] bg-[var(--sq-surface)] p-3 flex flex-col justify-between overflow-hidden border-0 rounded-md shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02] group-active:scale-[0.98]">
            <div className="flex items-center justify-between relative z-10">
              <div className="text-[10px] font-semibold tracking-widest text-[var(--sq-muted)]">HEALTH CARE CARD</div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white flex items-center justify-center pointer-events-none">
              <Wifi className="w-8 h-8 rotate-90 text-[var(--sq-ink-2)]" strokeWidth={2.25} />
            </div>
            <div className="relative z-10" />
          </div>
        </button>
      </div>
      <div className="text-center text-[11px] font-medium text-[var(--sq-muted)] mt-2">Tap card to start demo</div>

      <div className="px-5 pt-4">
        <div className="text-center text-[12px] text-[var(--sq-muted)] mb-2">We accept</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { name: "nib", src: nibLogo },
            { name: "Medibank", src: medibankLogo },
            { name: "HCF", src: hcfLogo },
            { name: "HealthPoint", src: healthpointLogo },
          ].map((b) => (
            <div
              key={b.name}
              className="w-12 h-8 rounded-md bg-white border border-[var(--sq-line)] flex items-center justify-center overflow-hidden"
            >
              <img src={b.src} alt={b.name} className="max-w-[80%] max-h-[70%] object-contain" />
            </div>
          ))}
          <button
            onClick={() => setShowMore(true)}
            className="w-12 h-8 rounded-md bg-[var(--sq-surface)] border border-[var(--sq-line)] flex items-center justify-center text-[10px] font-semibold text-[var(--sq-ink-2)] hover:bg-white transition"
          >
            +more
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-5 pb-5">
        <button onClick={onNext} className="sq-btn sq-btn-secondary">Enter manually</button>
      </div>

      {showMore && (
        <div className="absolute inset-0 z-10 flex items-end">
          <button
            onClick={() => setShowMore(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
          />
          <div className="relative w-full bg-white rounded-t-2xl max-h-[80%] flex flex-col shadow-2xl sq-fadein">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="text-[15px] font-semibold">Accepted insurers</div>
              <button
                onClick={() => setShowMore(false)}
                className="text-[12px] font-semibold text-[var(--sq-muted)]"
              >
                Close
              </button>
            </div>
            <div className="px-4 pb-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1.5">
                {MORE_BRANDS.map((b) => (
                  <div
                    key={b}
                    className="h-9 px-2 rounded-md border border-[var(--sq-line)] bg-white flex items-center justify-center text-[10px] font-semibold tracking-tight text-[var(--sq-ink-2)] text-center"
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
function Summary({ onAccept, onReject, onBack }: { onAccept: () => void; onReject: () => void; onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      gapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <TopBar onBack={onBack} title="Statement of Claim" />
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-6 pt-2 pb-2">
        <div className="sq-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--sq-muted)]">Servicing Location</div>
              <div className="text-[15px] font-semibold mt-1">Riverside Family Dental</div>
              <div className="text-[12px] text-[var(--sq-muted)] mt-0.5">Suit 1, 11 Digital St, Melbourne VIC 3000</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--sq-muted)]">Claim Ref</div>
              <div className="text-[12px] font-mono mt-1">GN 1234567X</div>
            </div>
          </div>
          <div className="sq-divider my-4" />
          <div className="sq-row">
            <div>
              <div className="text-[11px] text-[var(--sq-muted)] uppercase tracking-wider">Servicing Provider</div>
              <div className="text-[14px] font-medium mt-0.5">Dr. Laura Leopard</div>
              <div className="text-[11px] text-[var(--sq-muted)] mt-0.5">Provider No: 123456CD</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--sq-muted)] uppercase tracking-wider">Patient</div>
              <div className="text-[14px] font-medium mt-0.5">John Citizen</div>
              <div className="text-[11px] text-[var(--sq-muted)] mt-0.5">Medicare: 1234 56789 1 · IRN 1</div>
            </div>
          </div>
        </div>

        <div className="sq-card mt-4 p-5">
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--sq-muted)] mb-3">Service Details</div>
          <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--sq-muted)] pb-2">
            <div className="col-span-2">Item</div>
            <div className="col-span-6">Description</div>
            <div className="col-span-4 text-right">Charge</div>
          </div>
          <div className="sq-divider" />
          <div className="grid grid-cols-12 gap-2 py-3 text-[13px]">
            <div className="col-span-2 font-mono">23</div>
            <div className="col-span-6">Professional attendance — Level B consultation</div>
            <div className="col-span-4 text-right font-medium">$220.00</div>
          </div>
          <div className="sq-divider" />
          <div className="space-y-3.5 mt-4">
            <Line label="Total Charge" value="$220.00" />
            <Line label="Medicare Benefit" value="−$39.10" muted />
            <Line label="Private Health Rebate" value="−$120.90" muted />
          </div>
          <div className="sq-divider my-4" />
          <div ref={gapRef} className="rounded-lg bg-[var(--sq-surface)] p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--sq-muted)]">Gap Amount</span>
              <span className="text-[13px] font-medium text-[var(--sq-ink-2)] mt-1">Patient contribution</span>
            </div>
            <span className="text-[32px] font-semibold tracking-tight">$60.00</span>
          </div>
        </div>
        <div className="h-6" />

      </div>

      <div className="px-6 pb-3 pt-3 border-t border-[var(--sq-line)] bg-white flex gap-2">
        <button onClick={onReject} className="sq-btn sq-btn-secondary">Reject</button>
        <button onClick={onAccept} className="sq-btn sq-btn-primary">Accept</button>
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

/* ---------------- 5. TAP TO PAY ---------------- */
function Tap({ amount, onPaid, onBack }: { amount: number; onPaid: () => void; onBack: () => void }) {
  useEffect(() => {
    const t = setTimeout(onPaid, 3200);
    return () => clearTimeout(t);
  }, [onPaid]);

  return (
    <div className="absolute inset-0 bg-[#1A6FEB] text-white flex flex-col">
      <div className="px-5 pt-5 flex items-center">
        <button
          onClick={onBack}
          aria-label="Cancel"
          className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        >
          <X className="w-6 h-6" strokeWidth={2.25} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-6">
        <div className="relative w-[180px] h-[120px] flex items-center justify-center mb-8">
          <Wifi className="w-[110px] h-[110px] text-white rotate-90 opacity-95" strokeWidth={1.5} />
          <Hand className="absolute right-0 bottom-0 w-12 h-12 text-white" strokeWidth={1.75} />
        </div>
        <div className="text-[44px] leading-none font-semibold tracking-tight">
          ${amount.toFixed(2)}
        </div>
        <p className="mt-3 text-[15px] text-white/85 text-center">
          Tap, Insert, or Swipe
        </p>
        <p className="mt-1.5 text-[12px] text-white/60 text-center">
          {amount === 220 ? "Full amount — claim back ~$160 yourself" : "Gap for item 23 · GN 1234567X"}
        </p>
      </div>

      <div className="px-5 pb-5">
        <div className="h-12 rounded-md bg-white flex items-center justify-center">
          <div className="w-7 h-7 rounded-sm bg-[#1A6FEB] flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 6. DONE ---------------- */
function Done({ amount, selfClaim, onDone }: { amount: number; selfClaim: boolean; onDone: () => void }) {
  return (
    <>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <div className="sq-check">
          <Check className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <h2 className="mt-7 text-[26px] font-semibold tracking-tight">Payment Complete</h2>
        <p className="sq-sub mt-2">
          {selfClaim ? "Submit your receipt to Medicare and your fund to claim back." : "Your receipt has been recorded."}
        </p>

        <div className="sq-card mt-8 p-5 w-full text-left space-y-3.5">
          <Line label="Paid Today" value={`$${amount.toFixed(2)}`} />
          {selfClaim ? (
            <Line label="To Claim Back" value="$160.00" muted />
          ) : (
            <Line label="Insurance Covered" value="$160.00" muted />
          )}
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
