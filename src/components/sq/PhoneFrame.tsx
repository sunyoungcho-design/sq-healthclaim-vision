import { ReactNode } from "react";
import frameImg from "@/assets/terminal-frame.png";

export function PhoneFrame({ children, sideContent, belowContent }: { children: ReactNode; sideContent?: ReactNode; belowContent?: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-black text-white flex items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative shrink-0"
          style={{
            aspectRatio: "520 / 816",
            height: "min(816px, calc(100dvh - 120px))",
            backgroundImage: `url(${frameImg})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            clipPath: "inset(0 11% 9.9% 0)",
          }}
        >
          <div
            className="absolute overflow-hidden bg-black"
            style={{
              left: "14.23%",
              right: "calc(16.73% - 2px)",
              top: "5.88%",
              bottom: "calc(15.81% - 2px)",
            }}
          >
            {children}
          </div>
        </div>
        {belowContent}
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
