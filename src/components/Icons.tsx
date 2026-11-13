import type { IconKind } from "@/lib/site";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.19 1.6 6.02L4 29l8.1-1.57a12 12 0 0 0 3.94.66C22.68 28.1 28 22.7 28 16.06 28 9.4 22.68 3 16.04 3Zm0 22.1c-1.2 0-2.37-.32-3.4-.93l-.5-.3-4.8.93.95-4.68-.32-.52a9.1 9.1 0 0 1-1.4-4.86c0-5.02 4.1-9.1 9.12-9.1 5.02 0 9.1 4.08 9.1 9.1 0 5.03-4.08 9.36-8.75 10.36Zm5-6.8c-.27-.14-1.62-.8-1.87-.9-.25-.09-.43-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.27-.14-1.15-.42-2.2-1.35-.8-.72-1.35-1.6-1.5-1.87-.17-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.46.1-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.46-.62-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.66.2 1.25.17 1.72.1.52-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.2-.52-.34Z" />
    </svg>
  );
}

/** أيقونات متحركة بـ CSS لكل قسم */
export function CategoryIcon({ kind, className = "h-10 w-10" }: { kind: IconKind; className?: string }) {
  const common = { viewBox: "0 0 64 64", className, "aria-hidden": true as const };
  if (kind === "fan") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="32" cy="32" r="28" />
        <g className="spin-slow" style={{ transformOrigin: "32px 32px" }} fill="currentColor" stroke="none">
          <path d="M32 32C26 22 28 10 34 8c5 4 3 16-2 24Z" />
          <path d="M32 32C42 26 54 28 56 34c-4 5-16 3-24-2Z" />
          <path d="M32 32C38 42 36 54 30 56c-5-4-3-16 2-24Z" />
          <path d="M32 32C22 38 10 36 8 30c4-5 16-3 24 2Z" />
          <circle cx="32" cy="32" r="3.5" />
        </g>
      </svg>
    );
  }
  if (kind === "drum") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="6" y="4" width="52" height="56" rx="6" />
        <circle cx="32" cy="36" r="17" />
        <g className="spin-med" style={{ transformOrigin: "32px 36px" }} fill="currentColor" stroke="none">
          <path d="M32 36 20 36a12 12 0 0 1 12-12Z" />
          <path d="M32 36 44 36a12 12 0 0 1-12 12Z" />
        </g>
        <circle cx="14" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="22" cy="12" r="2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "flame") {
    return (
      <svg {...common} fill="currentColor">
        <g className="flame" style={{ transformOrigin: "32px 58px" }}>
          <path d="M32 4c2 10 14 16 14 32a14 14 0 0 1-28 0c0-8 4-12 8-16 0 6 3 8 5 8-3-10 0-18 1-24Z" />
        </g>
        <path d="M32 58a7 7 0 0 1-7-7c0-5 4-7 7-12 3 5 7 7 7 12a7 7 0 0 1-7 7Z" fill="#14213D" opacity=".35" />
      </svg>
    );
  }
  // gear
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg {...common} fill="currentColor">
      <g className="spin-slow" style={{ transformOrigin: "32px 32px" }}>
        {teeth.map((a) => (
          <rect key={a} x="27" y="2" width="10" height="14" rx="2" transform={`rotate(${a} 32 32)`} />
        ))}
        <path fillRule="evenodd" d="M32 12a20 20 0 1 0 0 40 20 20 0 0 0 0-40Zm0 12a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z" />
      </g>
    </svg>
  );
}
