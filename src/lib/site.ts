export type IconKind = "fan" | "drum" | "flame" | "gear";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: IconKind;
  images: { src: string; alt: string }[];
  message: string;
};

export const categories: Category[] = [
  {
    slug: "air-conditioners",
    name: "تكييفات",
    tagline: "سبليت أو شباك أو كونسيل، شغال أو عطلان — بنشتريه.",
    icon: "fan",
    images: [
      { src: "/images/ac-1.jpg", alt: "تكييفات مستعملة متراصة" },
      { src: "/images/ac-2.jpg", alt: "تكييف سبليت قديم ووحدة خارجية" },
      { src: "/images/ac-3.jpg", alt: "تكييفات كونسيل وسبليت" },
      { src: "/images/ac-4.jpg", alt: "وحدات تكييف قديمة" },
    ],
    message: "مرحباً، عندي تكييف عاوز أبيعه.",
  },
  {
    slug: "washing-machines",
    name: "غسالات",
    tagline: "أوتوماتيك أو نصف أوتوماتيك، قديمة أو متبهدلة — ابعتلنا صورتها.",
    icon: "drum",
    images: [
      { src: "/images/washer-1.jpg", alt: "غسالة أوتوماتيك قديمة" },
      { src: "/images/washer-2.jpg", alt: "غسالة إنديزيت" },
    ],
    message: "مرحباً، عندي غسالة عاوز أبيعها.",
  },
  {
    slug: "heaters",
    name: "سخانات",
    tagline: "سخانات غاز قديمة بأي حالة — بنسعرها ونستلمها.",
    icon: "flame",
    images: [{ src: "/images/heater-1.jpg", alt: "سخانات غاز قديمة" }],
    message: "مرحباً، عندي سخان عاوز أبيعه.",
  },
  {
    slug: "scrap",
    name: "خردة وحديد وحاجات تانية",
    tagline: "حديد، نحاس، أجهزة عطلانة، وأي حاجة قديمة واخدة مكان عندك.",
    icon: "gear",
    images: [
      { src: "/images/scrap-1.jpg", alt: "كومة خردة وأجهزة قديمة" },
      { src: "/images/scrap-2.jpg", alt: "حديد خردة" },
    ],
    message: "مرحباً، عندي خردة وحديد وحاجات قديمة عاوز أبيعها.",
  },
];

// صور الخلفية المتحركة في أول الصفحة
export const wallImages = categories.flatMap((c) => c.images.map((i) => i.src));

export const steps = [
  { title: "اتواصل معانا", body: "دوس على الزر وابعتلنا صور الحاجة على واتساب." },
  { title: "هنسعرلك", body: "هنرد عليك بسعر حلو وواضح في أسرع وقت." },
  { title: "نيجي ندفعلك كاش", body: "لو وافقت، نيجي لحد عندك ونستلم وندفعلك فلوس في إيدك." },
];

export const perks = [
  { icon: "💵", title: "فلوس كاش", body: "بتقبض في إيدك لحظة الاستلام." },
  { icon: "🚚", title: "لحد عندك", body: "إحنا اللي بنيجي ونشيل، من غير نقل ولا تعب." },
  { icon: "🏷️", title: "أسعار حلوة", body: "بنسعّر كل حاجة بسعر عادل حسب حالتها." },
];

export const ticker = [
  "تكييفات", "غسالات", "سخانات", "حديد", "خردة", "ثلاجات", "أجهزة قديمة", "أي حاجة مستعملة",
];

export const faq = [
  { q: "بتشتروا التكييفات والغسالات العطلانة؟", a: "أيوه، بنشتري الشغال والعطلان. ابعتلنا صورة على واتساب وهنسعرلك حسب حالته." },
  { q: "بتشتروا حديد وخردة؟", a: "أيوه، بنشتري الحديد والخردة والأجهزة القديمة وأي حاجة مستعملة واخدة مكان عندك." },
  { q: "هقبض إزاي؟", a: "فلوس كاش في إيدك لحظة الاستلام." },
  { q: "لازم أوديلكم الحاجة؟", a: "لأ، إحنا اللي بنيجي لحد عندك ونستلم." },
  { q: "هعرف السعر إزاي؟", a: "اتواصل معانا على واتساب وابعت صور، وهنرد عليك بسعر حلو وواضح." },
];
