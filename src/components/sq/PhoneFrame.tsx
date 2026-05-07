import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-[var(--sq-surface)] flex items-stretch md:items-center justify-center md:py-10">
      <div className="w-full md:w-[390px] md:h-[844px] md:rounded-[48px] md:border md:border-[var(--sq-line)] md:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] bg-white overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="sq-statusbar">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-2.5 border border-current rounded-[3px] relative">
          <span className="absolute inset-[1px] right-[3px] bg-current rounded-[1px]" />
        </span>
      </span>
    </div>
  );
}
