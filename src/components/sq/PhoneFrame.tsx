import { ReactNode } from "react";
import frameImg from "@/assets/terminal-frame.png";

export function PhoneFrame({ children, sideContent }: { children: ReactNode; sideContent?: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-[var(--sq-surface)] flex items-center justify-center p-4 gap-8">
      <div
        className="relative shrink-0"
        style={{
          aspectRatio: "520 / 816",
          height: "min(816px, calc(100dvh - 32px))",
          backgroundImage: `url(${frameImg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute overflow-hidden bg-white"
          style={{
            left: "14.23%",
            right: "16.73%",
            top: "5.88%",
            bottom: "15.81%",
          }}
        >
          {children}
        </div>
      </div>
      {sideContent}
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="sq-statusbar">
      <span>10:03</span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-2.5 border border-current rounded-[3px] relative">
          <span className="absolute inset-[1px] right-[3px] bg-current rounded-[1px]" />
        </span>
      </span>
    </div>
  );
}
