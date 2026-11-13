import { WhatsAppIcon } from "./Icons";
import { businessNumber, defaultMessage, waLink } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <a
      href={waLink(businessNumber, defaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="اتواصل معانا على واتساب"
      className="pulse-ring fixed bottom-4 start-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
