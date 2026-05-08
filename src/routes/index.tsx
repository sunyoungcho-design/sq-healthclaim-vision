import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame, StatusBar } from "@/components/sq/PhoneFrame";
import { ChevronLeft, CreditCard, Check, Wifi, Apple, X, Hand } from "lucide-react";
import nibLogo from "@/assets/insurers/nib.png";
import medibankLogo from "@/assets/insurers/medibank.png";
import hcfLogo from "@/assets/insurers/hcf.avif";
import healthpointLogo from "@/assets/insurers/healthpoint.png";
import contactlessIcon from "@/assets/contactless.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Square Health — Modern healthcare payments" },
      { name: "description", content: "A clean, modern healthcare claims and payment prototype in Square design language." },
    ],
  }),
  component: Index,
});

type Step = "scan" | "verify" | "summary" | "tap" | "receipt" | "done";

function Index() {
  const [step, setStep] = useState<Step>("scan");
  const [amount, setAmount] = useState<number>(60);
  const [printed, setPrinted] = useState(false);

  // Preload the contactless icon so it's cached before the tap screen mounts
  useEffect(() => {
    const img = new Image();
    img.src = contactlessIcon;
  }, []);

  const reset = () => { setAmount(60); setStep("scan"); setPrinted(false); };

  return (
    <PhoneFrame sideContent={printed ? <PrintedReceipt amount={amount} /> : undefined}>
      <div className={`sq-screen${step === "scan" ? " sq-screen-dark" : ""}${step === "tap" ? " sq-screen-blue" : ""}`} key={step}>
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
          {step === "tap" && <Tap amount={amount} onPaid={() => setStep("receipt")} onBack={() => setStep("summary")} />}
          {step === "receipt" && (
            <Receipt
              amount={amount}
              onSelect={() => setStep("done")}
              onPrint={() => { setPrinted(true); setStep("done"); }}
            />
          )}
          {step === "done" && <Done amount={amount} selfClaim={amount === 220} onDone={reset} />}
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

      <div className="flex items-center justify-center px-6 pt-8">
        <button
          onClick={onNext}
          aria-label="Tap to scan health card"
          className="group relative w-[220px] h-[220px] flex items-center justify-center focus:outline-none"
        >
          <div className="absolute inset-0 rounded-full bg-[#141414]" />
          <div className="absolute inset-0 rounded-full border border-white/30 sq-tap-ring" />
          <div className="absolute inset-0 rounded-full border border-white/30 sq-tap-ring" style={{ animationDelay: "1.75s" }} />
          <div className="absolute inset-4 rounded-full border border-[var(--sq-line)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
          <div className="relative w-[150px] h-[110px] bg-[#1a1a1f] p-3 flex flex-col justify-between overflow-hidden border border-white/5 rounded-md shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02] group-active:scale-[0.98]">
            <div className="flex items-center justify-between relative z-10">
              <div className="text-[10px] font-semibold tracking-widest text-white/50">HEALTH CARE CARD</div>
            </div>
            <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-12 h-12 rounded-full bg-transparent flex items-center justify-center pointer-events-none">
              <Wifi className="lucide lucide-wifi w-6 h-6 rotate-90 text-[#797777]" strokeWidth={2.25} />
            </div>
            <div className="relative z-10" />
          </div>
        </button>
      </div>
      

      <div className="px-5 pt-8">
        <div className="text-center text-[12px] text-white/60 mb-2">We accept</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { name: "nib", src: nibLogo },
            { name: "Medibank", src: medibankLogo },
            { name: "HCF", src: hcfLogo },
            { name: "HealthPoint", src: healthpointLogo },
          ].map((b) => (
            <div
              key={b.name}
              className="w-12 h-8 flex items-center justify-center overflow-hidden border border-white/10 rounded-none bg-white/0"
            >
              <img src={b.src} alt={b.name} className="max-w-[80%] max-h-[70%] object-contain" />
            </div>
          ))}
          <button
            onClick={() => setShowMore(true)}
            className="w-12 h-8 flex items-center justify-center text-[10px] font-semibold text-white/80 transition border-0 underline bg-white/10 rounded"
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
          <div className="relative w-full bg-[#18181c] rounded-t-2xl max-h-[80%] flex flex-col shadow-2xl sq-fadein">
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
                    className="h-9 px-2 rounded-md border border-white/10 bg-white/10 flex items-center justify-center text-[10px] font-semibold tracking-tight text-white/80 text-center"
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
      
    </>
  );
}

/* ---------------- 3. SUMMARY ---------------- */
function Summary({ onAccept, onReject, onBack }: { onAccept: () => void; onReject: () => void; onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const container = scrollRef.current;
      const target = gapRef.current;
      if (!container || !target) return;
      const targetTop =
        target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
      const startTop = container.scrollTop;
      const distance = targetTop - startTop;
      const duration = 1400; // ms — slower for a smoother feel
      const startTime = performance.now();
      // easeInOutCubic
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      let raf = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        container.scrollTop = startTop + distance * ease(p);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
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
    <div className="absolute inset-0 bg-[#006AFF] text-white flex flex-col">
      <div className="px-5 pt-4 flex items-center justify-between text-white">
        <button
          onClick={onBack}
          aria-label="Cancel"
          className="w-8 h-8 -ml-1 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
        <button className="text-[12px] font-medium opacity-90 hover:opacity-100">English</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-3 -mt-4">
        <img
          src={contactlessIcon}
          alt="Contactless"
          className="w-[170px] h-auto mb-7"
          style={{ filter: "invert(1)", mixBlendMode: "screen" }}
        />


        <div className="sq-h1 text-white">${amount.toFixed(2)}</div>
        <p className="sq-h1 text-white mt-1 whitespace-nowrap">Tap, Insert or Swipe</p>

      </div>

      {/* Card insertion visualization — card inserted chip-first (rotated 90°) */}
      <div className="relative">
        <div className="relative mx-auto w-[44%] h-28">
          <div className="absolute inset-x-0 top-0 h-full rounded-t-xl bg-gradient-to-b from-white via-[#f4f4f4] to-[#dcdcdc] shadow-[0_-6px_18px_rgba(0,0,0,0.18)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
            {/* chip — centered horizontally near top because card is inserted short-edge first */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-8 rounded-[4px] bg-gradient-to-br from-[#e8c869] to-[#9a7a18] shadow-sm">
              <div className="absolute inset-[3px] rounded-[2px] border border-[#7a5e10]/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#7a5e10]/50" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#7a5e10]/50" />
            </div>
          </div>
        </div>
        {/* Slot */}
        <div className="relative h-5 bg-[#003a99] flex items-center justify-center">
          <div className="absolute inset-x-0 top-0 h-px bg-black/40" />
          <div className="w-[50%] h-1.5 rounded-full bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
        </div>
      </div>

    </div>
  );
}

/* ---------------- 6. RECEIPT OPTIONS ---------------- */
function Receipt({ amount, onSelect, onPrint }: { amount: number; onSelect: () => void; onPrint: () => void }) {
  return (
    <>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center -mt-4">
        <div className="text-[15px] font-semibold tracking-tight">Gap Amount ${amount.toFixed(2)}</div>
        <h2 className="mt-2 text-[34px] font-semibold tracking-tight">Thank you</h2>
      </div>
      <div className="px-6 pb-6 space-y-2.5">
        <button onClick={onSelect} className="sq-btn sq-btn-primary">Email</button>
        <button onClick={onSelect} className="sq-btn sq-btn-primary">Text</button>
        <button onClick={onPrint} className="sq-btn sq-btn-primary">Print</button>
        <button onClick={onSelect} className="sq-btn sq-btn-primary">No receipt</button>
      </div>
    </>
  );
}

/* ---------------- PRINTED RECEIPT (outside the device) ---------------- */
function PrintedReceipt({ amount }: { amount: number }) {
  const charge = 220;
  const benefit = (160).toFixed(2);
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getFullYear()).slice(2)} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return (
    <div className="sq-receipt-print">
      <div
        className="bg-[#fafaf5] text-black font-mono text-[11px] leading-[1.45] shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        style={{
          width: "280px",
          padding: "20px 20px 32px",
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 22px, rgba(0,0,0,0.025) 22px 23px)",
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 8px), 95% 100%, 90% calc(100% - 6px), 85% 100%, 80% calc(100% - 6px), 75% 100%, 70% calc(100% - 6px), 65% 100%, 60% calc(100% - 6px), 55% 100%, 50% calc(100% - 6px), 45% 100%, 40% calc(100% - 6px), 35% 100%, 30% calc(100% - 6px), 25% 100%, 20% calc(100% - 6px), 15% 100%, 10% calc(100% - 6px), 5% 100%, 0 calc(100% - 8px))",
        }}
      >
        <div className="text-center">
          <div className="text-[16px] font-bold tracking-[0.18em]">RIVERSIDE FAMILY DENTAL</div>
          <div className="text-[9px] tracking-wide mt-0.5">Suite 1, 11 Digital St, Melbourne VIC 3000</div>
          <div className="text-[9px] tracking-wide">ABN 12 345 678 910 · (03) 9000 1234</div>
        </div>

        <div className="my-3 border-t border-black/60" />

        <div className="text-center font-bold tracking-[0.2em] text-[12px] mb-2">CUSTOMER COPY</div>

        <div className="space-y-0.5">
          <div className="flex justify-between"><span>Merchant ID</span><span>10293847</span></div>
          <div className="flex justify-between"><span>Terminal ID</span><span>T-00421</span></div>
          <div className="flex justify-between"><span>Date/Time</span><span>{date}</span></div>
        </div>

        <div className="mt-3 space-y-0.5">
          <div className="flex justify-between"><span>PROVIDER NAME</span><span>DR L. LEOPARD</span></div>
          <div className="flex justify-between"><span>PROVIDER NUMBER</span><span>123456CD</span></div>
        </div>

        <div className="my-2 border-t border-dashed border-black/40" />
        <div className="font-semibold">MEDIBANK PRIVATE HEALTH</div>
        <div className="my-2 border-t border-dashed border-black/40" />

        <div className="font-bold tracking-[0.15em] text-[12px] mt-2">SERVICES CLAIMED:</div>
        <div className="my-1 border-t border-dashed border-black/40" />
        <div className="grid grid-cols-12 gap-1 text-[9px] font-bold tracking-wider">
          <div className="col-span-3">SERVICE</div>
          <div className="col-span-4">DESCRIPTION</div>
          <div className="col-span-2 text-right">CHARGE</div>
          <div className="col-span-3 text-right">BENEFIT</div>
        </div>
        <div className="my-1 border-t border-dashed border-black/40" />

        <div className="text-[10px] mt-2">Patient Id: JOHN CITIZEN</div>
        <div className="grid grid-cols-12 gap-1 text-[10px]">
          <div className="col-span-3">023</div>
          <div className="col-span-4">CONSULT</div>
          <div className="col-span-2 text-right">DOS</div>
          <div className="col-span-3 text-right">{date.slice(0,5)}</div>
        </div>
        <div className="grid grid-cols-12 gap-1 text-[10px]">
          <div className="col-span-3">APPROVED</div>
          <div className="col-span-4">00</div>
          <div className="col-span-2 text-right">${charge}.00</div>
          <div className="col-span-3 text-right">${benefit}</div>
        </div>

        <div className="mt-2 text-[10px]">RRN: 000031234217</div>
        <div className="my-2 border-t border-dashed border-black/40" />

        <div className="flex justify-between text-[11px] font-semibold">
          <span>CLAIM TOTAL</span>
          <span>${charge}.00 &nbsp; ${benefit}</span>
        </div>
        <div className="my-2 border-t border-dashed border-black/40" />

        <div className="flex justify-between text-[15px] font-bold tracking-wider mt-2">
          <span>GAP PAYMENT</span>
          <span>${amount.toFixed(2)}</span>
        </div>

        <div className="mt-3 text-[10px]">TXN RESPONSE:</div>
        <div className="flex justify-between font-bold text-[13px] tracking-widest">
          <span>APPROVED</span>
          <span>00</span>
        </div>

        <div className="mt-3 flex justify-between text-[10px]">
          <span>SWIPE COMM TYPE</span>
          <span>BASE</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>DELIVERY COMM TYPE</span>
          <span>ETHERNET</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 7. DONE ---------------- */
function Done({ amount, selfClaim, onDone }: { amount: number; selfClaim: boolean; onDone: () => void }) {
  return (
    <>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <div className="sq-check">
          <Check className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <h2 className="mt-7 text-[26px] font-semibold tracking-tight">Printed!</h2>
        {selfClaim && (
          <p className="sq-sub mt-2">Submit your receipt to Medicare and your fund to claim back.</p>
        )}

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
      </div>
    </>
  );
}
