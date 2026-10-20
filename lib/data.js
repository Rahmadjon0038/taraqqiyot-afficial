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
  "suniy-intellekt",
];

export const applicationTypes = {
  "english-course": { name: "Ingliz tili kursi", course: "ingliz-tili" },
  "german-course": { name: "Nemis tili kursi", course: "nemis-tili" },
  "teacher-vacancy": { name: "Rus va ona tili o'qituvchisi vakansiyasi", course: null },
  // DM platformadan qo'lda nomlangan vakansiyalar: aniq nom vacancyTitle orqali keladi.
  vacancy: { name: "Vakansiya", course: null },
};

export const branchNames = {
  davlatobod: "Davlatobod",
  boburshox: "Boburshox",
  chorsu: "Chorsu",
};

// embed — sahifadagi xarita (iframe), map — "Xaritada ochish" tugmasi ochadigan havola.
// Mo'ljallar (landmark) har bir tilda lib/i18n.js ichida.
export const branchInfo = {
  boburshox: {
    map: "https://maps.app.goo.gl/nEYLrEF9KNPfPE7Z7",
    embed: "https://www.google.com/maps?q=40.9948371,71.676184&z=17&output=embed",
    geo: [40.9948371, 71.676184],
    hours: "08:00–22:00",
    phone: "+998 99 695 55 50",
  },
  chorsu: {
    map: "https://maps.app.goo.gl/zGx4HNKkpkMhYhQ9A",
    embed: "https://www.google.com/maps?q=41.002560,71.677245&z=17&output=embed",
    geo: [41.00256, 71.677245],
    hours: "08:00–21:00",
    phone: "+998 99 909 55 50",
  },
  davlatobod: {
    map: "https://www.google.com/maps/search/?api=1&query=Taraqqiyot%20Teaching%20Center%20Davlatobod%20tumani%2C%201-mikrorayon",
    embed:
      "https://www.google.com/maps?q=Taraqqiyot%20Teaching%20Center%20Davlatobod%20tumani%2C%201-mikrorayon&z=16&output=embed",
    hours: "08:00–21:00",
    phone: "+998 99 511 55 50",
  },
};

// O'zbekcha nomlar — Telegram'ga yuboriladigan arizalar uchun. Sayt matnlari lib/i18n.js ichida.
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
  "suniy-intellekt": "Sun'iy intellekt",
};

// Sertifikat rasmlari public/certificates/ papkasida. Saytga qo'yishdan oldin har bir rasmda
// pasport/ID raqami yopilgan — yangi sertifikat qo'shganda ham shunday qiling.
// fit: "contain" — rasm kesilmasdan to'liq ko'rsatiladi (tayyor afisha ko'rinishidagi rasmlar uchun).
export const certificates = [
  { image: "/certificates/ielts-muxtarov.jpg", name: "Muxtarov Xamidxon", result: "IELTS 8.0", fit: "contain" },
  { image: "/certificates/ielts-oybekov.jpg", name: "Oybekov", result: "IELTS 7.5", fit: "contain" },
  { image: "/certificates/abilova-dilafruz.jpg", name: "Abilova Dilafruz", course: "turk-tili", level: "B2" },
  { image: "/certificates/ganiyeva-muxfira.jpg", name: "G'aniyeva Muxfira", course: "turk-tili", level: "B2" },
  { image: "/certificates/safaraliyeva-shodiya.jpg", name: "Safaraliyeva Shodiya", course: "turk-tili", level: "B2" },
  { image: "/certificates/isomiddinova-muslimaxon.jpg", name: "Isomiddinova Muslimaxon", course: "turk-tili", level: "B2" },
  { image: "/certificates/olimova-gulzoda.jpg", name: "Olimova Gulzoda", course: "turk-tili", level: "B2" },
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
