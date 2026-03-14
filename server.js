const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

/*
====================================
KONFIGURASI UTAMA
====================================
*/

const VERIFY_TOKEN = "kedaimedia123";
const ACCESS_TOKEN = "EAARwNbUXAHgBQ0bxFa3PmpoZC0XRVvvIiIzSFUtyVnK76JU6sOajmk3mur7ZA8bwi9UEGdbz5GybXZC66BETuyKIupnZBip5MqDrAhCMA1zuDWsNf0mbsPtXL9zCDTiJ1mJGtrXOxeZAyRhaiMu2k1FEkbGVJZB7SHfrEYnAH1uXoZCIYZBujAbqTpDfAf5my8RP9DJGLNpR7wxVzWTMIIWiGbPLgk7BtdSUr9kaZB6jC";
const PHONE_NUMBER_ID = "989399234262931";
const ADMIN_NUMBER = "6282285781863";
const WEBSITE_URL = "https://kedaimedia.com";
const ADMIN_WA = "6282285781863";

/*
====================================
OPENAI INIT
====================================
*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
====================================
DATABASE MEMORY USER
====================================
*/

const users = {};

/*
====================================
ROOT TEST
====================================
*/

app.get("/", (req, res) => {
  res.send("KEDAI MEDIA SALES AI PRO AKTIF - FULL MENU VERSION");
});

/*
====================================
VERIFY WEBHOOK
====================================
*/

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/*
====================================
TERIMA PESAN MASUK
====================================
*/

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;

      // Handle Text Message
      if (msg.type === "text") {
        const text = msg.text.body.toLowerCase();
        
        if (!users[from]) {
          users[from] = { welcomeSent: true, notified: false };
          await kirimWelcome(from);
          await kirimNotifikasiAdmin(from, "Client baru menghubungi bot");
        } else {
          await balasAI(from, msg.text.body);
        }
      }
      
      // Handle Interactive Button Click
      else if (msg.type === "interactive") {
        const interactive = msg.interactive;
        
        // Handle List Reply
        if (interactive.type === "list_reply") {
          const id = interactive.list_reply.id;
          await handleMenuSelection(from, id);
        }
        // Handle Button Reply
        else if (interactive.type === "button_reply") {
            const id = interactive.button_reply.id;
            await handleMenuSelection(from, id);
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.log("ERROR WEBHOOK:", err.message);
    res.sendStatus(200);
  }
});

/*
====================================
WELCOME MESSAGE DENGAN TOMBOL MENU
====================================
*/

async function kirimWelcome(to) {
  const text = `Selamat datang di *KEDAI MEDIA*! 👋

Kami adalah partner digital terpercaya untuk UMKM, Perusahaan, Instansi Pemerintah, Sekolah, dan Bisnis.

Silakan pilih menu di bawah ini untuk melihat layanan kami:`;

  const sections = [
    {
      title: "Layanan Utama",
      rows: [
        {
          id: "layanan_pemulihan",
          title: "Pemulihan & Hapus Akun",
          description: "FB, IG, TikTok, Gmail, YT (Mulai 200rb)"
        },
        {
          id: "layanan_wa_automation",
          title: "WhatsApp Automation",
          description: "Bot Auto Reply, CRM, Marketing"
        },
        {
          id: "layanan_website",
          title: "Pembuatan Website",
          description: "Company Profile, Toko Online, Sekolah"
        },
        {
          id: "layanan_desain",
          title: "Desain Logo & Branding",
          description: "Logo, Brand Kit, Identitas Visual"
        }
      ]
    },
    {
      title: "Digital Marketing & IT",
      rows: [
        {
          id: "layanan_iklan",
          title: "Iklan (FB, IG, Google Ads)",
          description: "Tata kelola iklan berbayar"
        },
        {
          id: "layanan_seo",
          title: "Jasa SEO",
          description: "Optimasi website di halaman Google"
        },
        {
          id: "layanan_sistem",
          title: "Sistem Custom",
          description: "Aplikasi internal, API, Integrasi"
        }
      ]
    },
    {
      title: "Informasi Lainnya",
      rows: [
        {
          id: "info_kontak",
          title: "Hubungi Admin",
          description: "Konsultasi langsung via WhatsApp"
        },
        {
          id: "info_website",
          title: "Website Resmi",
          description: "Kunjungi kedaimedia.com"
        },
        {
          id: "info_pembayaran",
          title: "Info Pembayaran",
          description: "Ketentuan pembayaran 50% DP"
        }
      ]
    }
  ];

  await kirimListMenu(to, "Kedai Media Official", text, "Pilih Menu", sections);
}

/*
====================================
HANDLER PILIHAN MENU (PERBAIKAN BUG)
====================================
*/

async function handleMenuSelection(to, id) {
  switch (id) {
    case "layanan_pemulihan":
      await kirimLayananPemulihan(to);
      break;
    case "layanan_wa_automation":
      await kirimLayananWA(to);
      break;
    case "layanan_website":
      await kirimLayananWebsite(to);
      break;
    case "layanan_desain":
      await kirimLayananDesain(to);
      break;
    case "layanan_iklan":
      await kirimLayananIklan(to);
      break;
    case "layanan_seo":
      await kirimLayananSEO(to);
      break;
    case "layanan_sistem":
      await kirimLayananSistem(to);
      break;
    case "info_kontak":
      await kirimInfoKontak(to);
      break;
    case "info_website":
      await kirimText(to, `Kunjungi website resmi kami untuk informasi lengkap:\n${WEBSITE_URL}`);
      break;
    case "info_pembayaran":
      await kirimText(to, `*KETENTUAN PEMBAYARAN*\n\nUntuk memulai pengerjaan, kami menerapkan sistem pembayaran:\n\n💰 *DP (Down Payment): 50%*\n💳 *Pelunasan: 50%* (setelah pekerjaan selesai)\n\nPembayaran bisa via Transfer Bank / E-Wallet.\n\nKetik 'Order' untuk melakukan pemesanan.`);
      break;
    default:
      await balasAI(to, id);
  }
}

/*
====================================
KATALOG LAYANAN & HARGA
====================================
*/

async function kirimLayananPemulihan(to) {
  const text = `*🛡️ LAYANAN PEMULIHAN & PENGHAPUSAN AKUN*

Kami membantu Anda mengembalikan akses akun atau menghapus akun yang tidak terpakai secara profesional.

*📋 Layanan Tersedia:*
• Facebook (Pemulihan/Hapus)
• Instagram (Pemulihan/Hapus)
• TikTok (Pemulihan/Hapus)
• Gmail (Pemulihan/Hapus)
• YouTube (Pemulihan/Hapus)

*💰 ESTIMASI HARGA PASARAN:*
1. *Pemulihan Akun Biasa:* Mulai Rp 200.000
2. *Pemulihan Akun Berat (Hilang lama/virus):* Rp 500.000 - Rp 1.500.000
3. *Penghapusan Akun Permanen:* Rp 300.000
4. *Bantuan 2-Factor Auth:* Rp 250.000

⚠️ *Syarat & Ketentuan berlaku.*

Apakah Anda ingin konsultasi lebih lanjut?`;
  await kirimText(to, text);
}

async function kirimLayananWA(to) {
  const text = `*🤖 JASA WHATSAPP AUTOMATION*

Solusi otomatisasi bisnis untuk UMKM, Perusahaan, Instansi Pemerintah, dan Sekolah.

*📋 Layanan Tersedia:*
• Auto Reply Customer Service
• Chatbot Interaktif
• Blast Broadcast Message
• Sistem CRM Terintegrasi
• API Gateway WhatsApp

*💰 ESTIMASI HARGA PASARAN:*
1. *Auto Reply Sederhana:* Rp 300.000 - Rp 500.000
2. *Chatbot Katalog Produk:* Rp 750.000 - Rp 1.500.000
3. *Sistem Reservasi/Booking:* Rp 1.000.000 - Rp 2.500.000
4. *Custom Full System:* Mulai Rp 3.000.000

*💵 Pembayaran:* DP 50%.

Pilih fitur yang Anda butuhkan.`;
  await kirimText(to, text);
}

async function kirimLayananWebsite(to) {
  const text = `*🌐 JASA PEMBUATAN WEBSITE*

Pembuatan website profesional untuk berbagai kebutuhan.

*📋 Layanan Tersedia:*
• Website Company Profile
• Toko Online / E-Commerce
• Website Sekolah (SIAKAD)
• Website Instansi Pemerintah
• Landing Page Promosi
• Website UMKM

*💰 ESTIMASI HARGA PASARAN:*
1. *Landing Page:* Rp 500.000 - Rp 1.000.000
2. *Company Profile:* Rp 1.500.000 - Rp 3.000.000
3. *Toko Online (E-Commerce):* Rp 2.500.000 - Rp 5.000.000
4. *Website Sekolah/Instansi:* Rp 4.000.000 - Rp 10.000.000 (termasuk fitur admin)

*💵 Pembayaran:* DP 50%.

Konsultasikan kebutuhan website Anda.`;
  await kirimText(to, text);
}

async function kirimLayananDesain(to) {
  const text = `*🎨 JASA DESAIN LOGO & BRANDING*

Membangun identitas visual brand Anda agar terlihat profesional dan memorable.

*📋 Layanan Tersedia:*
• Desain Logo Profesional
• Brand Identity Kit (Kartu Nama, Amplop, Kop Surat)
• Desain Packaging
• Banner & Sosmed Template
• Company Profile Design

*💰 ESTIMASI HARGA PASARAN:*
1. *Desain Logo (1 Konsep):* Rp 300.000 - Rp 500.000
2. *Paket Logo + Brand Kit:* Rp 750.000 - Rp 1.500.000
3. *Desain Packaging:* Rp 500.000/desain
4. *Company Profile (PDF Design):* Rp 1.000.000 - Rp 2.500.000

*💵 Pembayaran:* DP 50%.

Apakah Anda siap membuat brand baru?`;
  await kirimText(to, text);
}

async function kirimLayananIklan(to) {
  const text = `*📣 JASA IKLAN DIGITAL (ADS)*

Maksimalkan penjualan dengan iklan yang tepat sasaran.

*📋 Layanan Tersedia:*
• Manajemen Facebook Ads
• Manajemen Instagram Ads
• Manajemen Google Ads (Search & Display)

*💰 ESTIMASI HARGA JASA:*
*(Belum termasuk budget iklan ke platform)*

1. *Setup Awal Iklan:* Rp 500.000 - Rp 1.000.000
2. *Manajemen Iklan Bulanan:* Rp 1.500.000 - Rp 3.000.000/bulan
3. *Iklan Event/Tunggal:* Rp 750.000/event
4. *Optimasi ROI:* Mulai Rp 2.000.000

*💵 Pembayaran:* DP 50%.

Target market Anda siap kami temukan.`;
  await kirimText(to, text);
}

async function kirimLayananSEO(to) {
  const text = `*🔍 JASA SEO (SEARCH ENGINE OPTIMIZATION)*

Optimasi website agar muncul di halaman pertama Google.

*📋 Layanan Tersedia:*
• Audit Website SEO
• Keyword Research
• On-Page SEO Optimization
• Off-Page SEO (Backlink Building)
• Local SEO (Google Maps)

*💰 ESTIMASI HARGA PASARAN:*
1. *SEO Audit:* Rp 500.000
2. *Paket SEO UMKM:* Rp 1.500.000 - Rp 3.000.000/bulan
3. *Paket SEO Perusahaan:* Rp 5.000.000 - Rp 10.000.000/bulan
4. *Paket SEO Instansi Pemerintah:* Custom Price

*💵 Pembayaran:* DP 50%.

Website Anda siap bersaing di Google?`;
  await kirimText(to, text);
}

async function kirimLayananSistem(to) {
  const text = `*⚙️ JASA PEMBUATAN SISTEM CUSTOM*

Pengembangan aplikasi berbasis web dan desktop sesuai kebutuhan spesifik.

*📋 Layanan Tersedia:*
• Sistem Inventori/Stok Barang
• Sistem Point of Sale (POS)
• Sistem Kepegawaian/Absensi
• Aplikasi Internal Perusahaan
• API Development & Integrasi

*💰 ESTIMASI HARGA PASARAN:*
Harga sistem custom bervariasi sesuai kompleksitas:
1. *Sistem Sederhana:* Mulai Rp 2.000.000
2. *Sistem Menengah:* Rp 5.000.000 - Rp 15.000.000
3. *Sistem Enterprise:* Mulai Rp 20.000.000

*💵 Pembayaran:* DP 50%.

Jelaskan kebutuhan sistem Anda.`;
  await kirimText(to, text);
}

async function kirimInfoKontak(to) {
  const text = `*📞 HUBUNGI ADMIN KEDAI MEDIA*

Anda ingin konsultasi langsung atau pemesanan?

Silakan hubungi Admin WhatsApp resmi kami:

Nomor: https://wa.me/${ADMIN_WA}
Website: ${WEBSITE_URL}

Admin akan merespon secepat mungkin.
Terima kasih telah memilih Kedai Media.`;
  await kirimText(to, text);
}

/*
====================================
SALES AI RESPONSE (GPT-4o)
====================================
*/

async function balasAI(to, pesanUser) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Kamu adalah Sales Professional Kedai Media.

Tugas kamu:
- Jawab semua chat customer dengan ramah dan profesional.
- Fokus pada closing penjualan dan arahkan customer ke menu atau hubungi admin.
- Jika customer tanya harga, sebutkan kisaran harga (range) sesuai data layanan.
- Jika customer serius, arahkan untuk melakukan pembayaran DP 50%.
- Jangan jawab di luar konteks layanan Kedai Media.

Layanan Utama:
1. Pemulihan Akun Sosmed (Mulai 200rb)
2. WhatsApp Automation (Mulai 300rb)
3. Pembuatan Website (Mulai 500rb)
4. Desain Logo & Branding (Mulai 300rb)
5. Iklan FB/IG/Google Ads (Mulai 500rb)
6. SEO (Mulai 500rb/bulan)
7. Sistem Custom (Mulai 2jt)

Jika customer bilang 'Order' atau 'Mau Pesan', arahkan ke Admin.
Website resmi: kedaimedia.com`
        },
        {
          role: "user",
          content: pesanUser
        }
      ],
      temperature: 0.7
    });

    const jawaban = response.choices[0].message.content;
    await kirimText(to, jawaban);

  } catch (err) {
    console.log("ERROR AI:", err.message);
    await kirimText(to, "Maaf, sistem AI sedang sibuk. Silakan hubungi admin langsung di wa.me/6282285781863");
  }
}

/*
====================================
FUNGI KIRIM WHATSAPP API
====================================
*/

// Fungsi Kirim Text Biasa
async function kirimText(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.log("Error kirim text:", err.response ? err.response.data : err.message);
  }
}

// Fungsi Kirim Interactive List Menu
async function kirimListMenu(to, headerText, bodyText, buttonText, sections) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: headerText
          },
          body: {
            text: bodyText
          },
          footer: {
            text: "© Kedai Media - Partner Digital Anda"
          },
          action: {
            button: buttonText,
            sections: sections
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.log("Error kirim list:", err.response ? err.response.data : err.message);
    // Fallback jika list gagal
    await kirimText(to, bodyText + "\n\n(Memuat menu gagal, silakan ketik layanan yang Anda cari)");
  }
}

/*
====================================
NOTIFIKASI ADMIN
====================================
*/

async function kirimNotifikasiAdmin(nomor, pesan) {
  await kirimText(
    ADMIN_NUMBER,
    `🔔 *LEAD BARU KEDAI MEDIA*\n\nNomor:\n${nomor}\n\nPesan:\n${pesan}`
  );
}

/*
====================================
START SERVER
====================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("KEDAI MEDIA SALES AI PRO AKTIF");
  console.log("PORT:", PORT);
  console.log("================================");
});
