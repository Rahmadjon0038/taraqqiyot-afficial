export const branches = [
  "davlatobod",
  "boburshox",
  "chorsu",
];

export const courses = [
  "ingliz-tili",
  "rus-tili",
  "turk-tili",
  "nemis-tili",
  "koreys-tili",
  "xitoy-tili",
  "yapon-tili",
  "matematika",
  "fizika",
  "kimyo",
  "biologiya",
  "ona-tili",
  "tarix",
  "mental-arifmetika",
  "kompyuter-savodxonligi",
  "it-kurslari",
];

export const branchNames = {
  davlatobod: "Davlatobod",
  boburshox: "Boburshox",
  chorsu: "Chorsu",
};

// embed — sahifadagi xarita (iframe), map — "Xaritada ochish" tugmasi ochadigan havola.
export const branchInfo = {
  boburshox: {
    map: "https://maps.app.goo.gl/nEYLrEF9KNPfPE7Z7",
    embed: "https://www.google.com/maps?q=40.9948371,71.676184&z=17&output=embed",
    geo: [40.9948371, 71.676184],
    landmark: "Bolalar stomatologiyasi ro'parasida",
    hours: "08:00–22:00",
    phone: "+998 99 695 55 50",
  },
  chorsu: {
    map: "https://maps.app.goo.gl/zGx4HNKkpkMhYhQ9A",
    embed: "https://www.google.com/maps?q=41.002560,71.677245&z=17&output=embed",
    geo: [41.00256, 71.677245],
    landmark: null,
    hours: "08:00–21:00",
    phone: "+998 99 909 55 50",
  },
  davlatobod: {
    map: "https://www.google.com/maps/search/?api=1&query=Taraqqiyot%20Teaching%20Center%20Davlatobod%20tumani%2C%201-mikrorayon",
    embed:
      "https://www.google.com/maps?q=Taraqqiyot%20Teaching%20Center%20Davlatobod%20tumani%2C%201-mikrorayon&z=16&output=embed",
    landmark: "Otchopar, Tegen Market 2-qavati",
    hours: "08:00–21:00",
    phone: "+998 99 511 55 50",
  },
};

export const courseNames = {
  "ingliz-tili": "Ingliz tili",
  "rus-tili": "Rus tili",
  "turk-tili": "Turk tili",
  "nemis-tili": "Nemis tili",
  "koreys-tili": "Koreys tili",
  "xitoy-tili": "Xitoy tili",
  "yapon-tili": "Yapon tili",
  matematika: "Matematika",
  fizika: "Fizika",
  kimyo: "Kimyo",
  biologiya: "Biologiya",
  "ona-tili": "Ona tili",
  tarix: "Tarix",
  "mental-arifmetika": "Mental arifmetika",
  "kompyuter-savodxonligi": "Kompyuter savodxonligi",
  "it-kurslari": "IT kurslari",
};

// Sertifikat rasmlari public/certificates/ papkasida. Saytga qo'yishdan oldin har bir rasmda
// pasport/ID raqami yopilgan — yangi sertifikat qo'shganda ham shunday qiling.
// fit: "contain" — rasm kesilmasdan to'liq ko'rsatiladi (tayyor afisha ko'rinishidagi rasmlar uchun).
export const certificates = [
  { image: "/certificates/ielts-muxtarov.jpg", name: "Muxtarov Xamidxon", result: "IELTS 8.0", fit: "contain" },
  { image: "/certificates/ielts-oybekov.jpg", name: "Oybekov", result: "IELTS 7.5", fit: "contain" },
  { image: "/certificates/abilova-dilafruz.jpg", name: "Abilova Dilafruz", result: "Turk tili · B2" },
  { image: "/certificates/ganiyeva-muxfira.jpg", name: "G'aniyeva Muxfira", result: "Turk tili · B2" },
  { image: "/certificates/safaraliyeva-shodiya.jpg", name: "Safaraliyeva Shodiya", result: "Turk tili · B2" },
  { image: "/certificates/isomiddinova-muslimaxon.jpg", name: "Isomiddinova Muslimaxon", result: "Turk tili · B2" },
  { image: "/certificates/olimova-gulzoda.jpg", name: "Olimova Gulzoda", result: "Turk tili · B2" },
];

// Instagram videolari: post yoki reels havolasini shu ro'yxatga qo'shing, masalan
// "https://www.instagram.com/reel/XXXXXXXXXXX/". Yangi videolar boshiga qo'shilsa, birinchi ko'rinadi.
// Toq o'rindagilar (1, 3, 5…) yuqori qatorga, juftlari (2, 4, 6…) pastki qatorga tushadi.
export const instagramVideos = [
  "https://www.instagram.com/p/DaSX1mUsAeN/",
  "https://www.instagram.com/p/DaK5B5WMxqR/",
  "https://www.instagram.com/p/DaaCaKbOxlx/",
  "https://www.instagram.com/p/DaGGjQKMESE/",
  "https://www.instagram.com/p/DZuTdSFMY3L/",
  "https://www.instagram.com/p/DZXDzFZuYTh/",
  "https://www.instagram.com/p/DZNF7kCM30P/",
  "https://www.instagram.com/p/DY7jYSesNMK/",
  "https://www.instagram.com/p/DY4DHMvu-Uz/",
  "https://www.instagram.com/p/DYpMcAGsDe6/",
  "https://www.instagram.com/p/DYl52CtMgZm/",
  "https://www.instagram.com/p/DYjJBBisZHo/",
  "https://www.instagram.com/p/DYZX7TEMq8y/",
  "https://www.instagram.com/p/DX9bQ4_s2Lc/",
  "https://www.instagram.com/p/DWWuyHGjBPh/",
  "https://www.instagram.com/p/DV86hRQDAtd/",
];

// SEO. Saytning to'liq manzili serverdagi .env faylidan olinadi (SITE_URL=https://domen.uz).
export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const siteName = "Taraqqiyot Teaching Center";
export const socialLinks = [
  "https://t.me/taraqqiyot_namangan_rasmiy",
  "https://www.instagram.com/taraqqiyot_namangan",
];

// Qidiruv tizimlari uchun har bir kursning qisqa ta'rifi.
export const courseSeo = {
  "ingliz-tili": "Ingliz tili kursi: noldan boshlab erkin so'zlashuvgacha, IELTS va CEFR imtihonlariga tayyorlov.",
  "rus-tili": "Rus tili kursi: noldan boshlab so'zlashuv, grammatika va savodxonlik.",
  "turk-tili": "Turk tili kursi: noldan boshlab B1–B2 darajagacha, davlat sertifikati imtihoniga tayyorlov.",
  "nemis-tili": "Nemis tili kursi: noldan boshlab so'zlashuv va grammatika, sertifikat imtihonlariga tayyorlov.",
  "koreys-tili": "Koreys tili kursi: noldan boshlab so'zlashuv, yozuv va TOPIK imtihoniga tayyorlov.",
  "xitoy-tili": "Xitoy tili kursi: noldan boshlab so'zlashuv, iyerogliflar va HSK imtihoniga tayyorlov.",
  "yapon-tili": "Yapon tili kursi: noldan boshlab so'zlashuv, yozuv va JLPT imtihoniga tayyorlov.",
  matematika: "Matematika kursi: maktab dasturi, mavzularni mustahkamlash va oliy ta'limga kirish imtihonlariga tayyorlov.",
  fizika: "Fizika kursi: nazariya va masalalar yechish, oliy ta'limga kirish imtihonlariga tayyorlov.",
  kimyo: "Kimyo kursi: nazariya va masalalar yechish, oliy ta'limga kirish imtihonlariga tayyorlov.",
  biologiya: "Biologiya kursi: maktab dasturi va oliy ta'limga kirish imtihonlariga tayyorlov.",
  "ona-tili": "Ona tili va adabiyot kursi: savodxonlik, grammatika va kirish imtihonlariga tayyorlov.",
  tarix: "Tarix kursi: O'zbekiston va jahon tarixi, oliy ta'limga kirish imtihonlariga tayyorlov.",
  "mental-arifmetika": "Mental arifmetika kursi: bolalar uchun tez hisoblash, diqqat va xotirani rivojlantirish.",
  "kompyuter-savodxonligi": "Kompyuter savodxonligi kursi: kompyuter, internet va ofis dasturlari bilan ishlashni noldan o'rganish.",
  "it-kurslari": "IT kurslari: dasturlash asoslari va zamonaviy raqamli kasblarni noldan o'rganish.",
};
