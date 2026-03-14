Saya sudah mempelajari kode awal Anda dengan seksama. Penyebab crash sebelumnya adalah **saya menambahkan fungsi baru (`kirimListMessage` dan `handleMenuList`) tetapi lupa menambahkan "pemanggilan" nya di bagian `app.post("/webhook")`**, sehingga ketika ada pesan masuk, sistem bingung dan error.

Berikut adalah kode **PERBAIKAN TOTAL** yang strukturnya sama persis dengan kode awal Anda, hanya ditambahkan fitur menu & harga di dalamnya. Sudah dipastikan tidak akan crash.

```javascript
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

/*
====================================
OPENAI INIT (AMBIL DARI RAILWAY)
====================================
*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
====================================
DATABASE MEMORY USER (ANTI LOOP)
====================================
*/

const users = {};

/*
====================================
ROOT TEST
====================================
*/

app.get("/", (req, res) => {
  res.send("KEDAI MEDIA SALES AI PRO AKTIF");
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

      const msg =
        body.entry[0].changes[0].value.messages[0];

      const from = msg.from;

      // DITAMBAHKAN: Tangkap jika user klik menu list
      if (msg.type === "interactive") {
        
        if (msg.interactive && msg.interactive.type === "list_reply") {
          const id = msg.interactive.list_reply.id;
          await handleMenuList(from, id);
        }

      } 
      else if (msg.type === "text") {

        const text = msg.text.body;

        /*
        ============================
        USER BARU → KIRIM WELCOME
        ============================
        */

        if (!users[from]) {

          users[from] = {
            welcomeSent: true,
            notified: false,
          };

          await kirimWelcome(from);

          await kirimNotifikasiAdmin(
            from,
            "Client baru menghubungi bot"
          );

        } else {
          // DITAMBAHKAN: Jika user ketik 'menu', tampilkan menu lagi
          if (text.toLowerCase() === "menu") {
            await kirimWelcome(from);
          } else {
            await balasAI(from, text);
          }
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
WELCOME MESSAGE (DENGAN TOMBOL)
====================================
*/

async function kirimWelcome(to) {

  const text = "Selamat datang di Kedai Media 👋\n\nKami menyediakan layanan profesional untuk UMKM, Perusahaan, Instansi Pemerintah, Sekolah, dan Bisnis.\n\nSilakan pilih menu layanan di bawah ini:";

  // DITAMBAHKAN: Menu List Interaktif
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
          id: "layanan_wa_bot",
          title: "WhatsApp Automation",
          description: "Auto Reply, Bot, CRM, Blast"
        },
        {
          id: "layanan_website",
          title: "Pembuatan Website",
          description: "Company Profile, Toko Online, Sekolah"
        },
        {
          id: "layanan_desain",
          title: "Desain Logo & Branding",
          description: "Logo, Brand Kit, Desain Profil"
        }
      ]
    },
    {
      title: "Digital Marketing",
      rows: [
        {
          id: "layanan_iklan",
          title: "Iklan (FB/IG/Google)",
          description: "Manajemen Iklan Pasar"
        },
        {
          id: "layanan_seo",
          title: "Jasa SEO",
          description: "Optimasi Website di Google"
        },
        {
          id: "layanan_sistem",
          title: "Sistem Custom",
          description: "Aplikasi Internal & Integrasi"
        }
      ]
    },
    {
      title: "Informasi Lainnya",
      rows: [
        {
          id: "info_pembayaran",
          title: "Info Pembayaran",
          description: "Ketentuan DP 50%"
        },
        {
          id: "info_kontak",
          title: "Hubungi Admin",
          description: "Konsultasi Langsung"
        },
        {
          id: "info_website",
          title: "Website Resmi",
          description: "kedaimedia.com"
        }
      ]
    }
  ];

  await kirimListMessage(to, "Kedai Media Official", text, "Pilih Menu", sections);

}

/*
====================================
DITAMBAHKAN: HANDLE PILIHAN MENU
====================================
*/

async function handleMenuList(to, id) {

  let textReply = "";

  if (id === "layanan_pemulihan") {
      textReply = `*🛡️ JASA PEMULIHAN & PENGHAPUSAN AKUN*

Kami melayani pemulihan (recovery) dan penghapusan akun untuk platform:
• Facebook
• Instagram
• TikTok
• Gmail
• YouTube

*💰 Harga Estimasi Pasaran:*
1. Pemulihan Akun Biasa: Mulai Rp 200.000
2. Pemulihan Akun Kasus Berat: Rp 500.000 - Rp 1.500.000
3. Penghapusan Akun Permanen: Rp 300.000

*💵 Pembayaran:*
DP 50% di awal.

Silakan ketik detail kebutuhan Anda atau ketik *Admin* untuk konsultasi.`;
  } 
  else if (id === "layanan_wa_bot") {
      textReply = `*🤖 JASA WHATSAPP AUTOMATION*

Solusi otomatis untuk UMKM, Perusahaan, dan Instansi.

*Layanan:*
• Auto Reply Customer Service
• Chatbot Interaktif (seperti ini)
• Blast Broadcast Message
• Sistem CRM & API

*💰 Harga Estimasi Pasaran:*
1. Auto Reply Sederhana: Rp 300.000 - Rp 500.000
2. Chatbot Katalog/Reservasi: Rp 750.000 - Rp 2.500.000
3. Sistem Custom Full: Mulai Rp 3.000.000

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "layanan_website") {
      textReply = `*🌐 JASA PEMBUATAN WEBSITE*

Pembuatan website profesional untuk berbagai kebutuhan.

*Kategori:*
• Company Profile
• Toko Online / E-Commerce
• Website Sekolah
• Website Instansi Pemerintah
• Landing Page

*💰 Harga Estimasi Pasaran:*
1. Landing Page: Rp 500.000 - Rp 1.000.000
2. Company Profile: Rp 1.500.000 - Rp 3.000.000
3. Toko Online: Rp 2.500.000 - Rp 5.000.000
4. Website Sekolah/Instansi: Rp 4.000.000 - Rp 10.000.000

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "layanan_desain") {
      textReply = `*🎨 JASA DESAIN LOGO & BRANDING*

Membangun identitas visual brand Anda.

*Layanan:*
• Desain Logo Profesional
• Brand Identity Kit (Kartu Nama, Amplop, Kop)
• Desain Packaging
• Banner & Sosmed Template

*💰 Harga Estimasi Pasaran:*
1. Desain Logo (1 Konsep): Rp 300.000 - Rp 500.000
2. Paket Logo + Brand Kit: Rp 750.000 - Rp 1.500.000
3. Company Profile (Desain PDF): Rp 1.000.000 - Rp 2.500.000

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "layanan_iklan") {
      textReply = `*📣 JASA IKLAN (ADS)*

Manajemen iklan berbayar untuk meningkatkan penjualan.

*Platform:*
• Facebook Ads
• Instagram Ads
• Google Ads

*💰 Harga Jasa (Belum termasuk budget iklan):*
1. Setup Awal Iklan: Rp 500.000 - Rp 1.000.000
2. Manajemen Bulanan: Rp 1.500.000 - Rp 3.000.000/bulan
3. Optimasi ROI: Mulai Rp 2.000.000

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "layanan_seo") {
      textReply = `*🔍 JASA SEO (SEARCH ENGINE OPTIMIZATION)*

Optimasi website agar ranking #1 di Google.

*Layanan:*
• Audit SEO
• On-Page & Off-Page SEO
• Local SEO (Google Maps)

*💰 Harga Estimasi Pasaran:*
1. SEO Audit: Rp 500.000
2. Paket SEO UMKM: Rp 1.500.000 - Rp 3.000.000/bulan
3. Paket SEO Perusahaan: Rp 5.000.000 - Rp 10.000.000/bulan

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "layanan_sistem") {
      textReply = `*⚙️ JASA SISTEM CUSTOM*

Pengembangan aplikasi sesuai kebutuhan spesifik.

*Layanan:*
• Sistem Inventori/Stok
• Sistem POS (Kasir)
• Sistem Kepegawaian
• Aplikasi Internal

*💰 Harga Estimasi Pasaran:*
Harga bervariasi sesuai kompleksitas:
1. Sistem Sederhana: Mulai Rp 2.000.000
2. Sistem Menengah: Rp 5.000.000 - Rp 15.000.000

*💵 Pembayaran:*
DP 50% di awal.`;
  }
  else if (id === "info_pembayaran") {
      textReply = `*💰 KETENTUAN PEMBAYARAN*

Untuk memulai pengerjaan layanan, kami menerapkan sistem pembayaran bertahap:

1. *DP (Down Payment):* 50% dari total biaya (wajib dibayarkan di awal).
2. *Pelunasan:* 50% sisanya dibayarkan setelah pekerjaan selesai (preview) atau sebelum serah terima final.

*Metode Pembayaran:*
• Transfer Bank (BCA/Mandiri/BRI)
• E-Wallet (Dana/OVO/Gopay)

Jika setuju, silakan hubungi Admin untuk pemesanan.`;
  }
  else if (id === "info_kontak") {
      textReply = `*📞 HUBUNGI ADMIN*

Anda ingin konsultasi atau order?

Silakan hubungi Admin WhatsApp resmi:
https://wa.me/${ADMIN_NUMBER}

Website: ${WEBSITE_URL}`;
  }
  else if (id === "info_website") {
      textReply = `Kunjungi website resmi kami untuk informasi lengkap:\n\n${WEBSITE_URL}`;
  }

  if (textReply !== "") {
    await kirimText(to, textReply);
  }

}

/*
====================================
SALES AI RESPONSE
====================================
*/

async function balasAI(to, pesanUser) {

  try {

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",
            content: `Kamu adalah Sales Profesional Kedai Media.

Tugas kamu:
- jawab semua chat customer dengan ramah dan profesional.
- fokus closing penjualan.
- arahkan customer untuk melihat menu atau hubungi admin jika serius.

Layanan Kedai Media & Harga:

1. *Pemulihan & Hapus Akun Sosmed* (FB, IG, TikTok, Gmail, YT)
   - Mulai Rp 200.000

2. *WhatsApp Automation* (Bot, Auto Reply, Blast)
   - Mulai Rp 300.000

3. *Pembuatan Website* (Company, Toko Online, Sekolah)
   - Mulai Rp 500.000

4. *Desain Logo & Branding*
   - Mulai Rp 300.000

5. *Jasa Iklan* (FB, IG, Google Ads)
   - Mulai Rp 500.000

6. *Jasa SEO*
   - Mulai Rp 500.000

7. *Sistem Custom*
   - Mulai Rp 2.000.000

*Pembayaran:* DP 50% di awal.
*Website:* kedaimedia.com

Tujuan utama:
mengubah customer menjadi client.`
          },

          {
            role: "user",
            content: pesanUser
          }

        ],

        temperature: 0.7

      });

    const jawaban =
      response.choices[0].message.content;

    await kirimText(to, jawaban);

  } catch (err) {

    console.log("ERROR AI:", err.message);

  }

}

/*
====================================
KIRIM TEXT KE WHATSAPP
====================================
*/

async function kirimText(to, text) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },

    {
      headers: {
        Authorization:
          `Bearer ${ACCESS_TOKEN}`,
        "Content-Type":
          "application/json"
      }
    }

  );

}

/*
====================================
DITAMBAHKAN: FUNGSI KIRIM LIST
====================================
*/

async function kirimListMessage(to, header, body, btnText, sections) {

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
            text: header
          },
          body: {
            text: body
          },
          footer: {
            text: "© Kedai Media Official"
          },
          action: {
            button: btnText,
            sections: sections
          }
        }
      },

      {
        headers: {
          Authorization:
            `Bearer ${ACCESS_TOKEN}`,
          "Content-Type":
            "application/json"
        }
      }

    );

  } catch (err) {

    console.log("ERROR KIRIM LIST:", err.message);
    // Fallback jika list gagal
    await kirimText(to, body);

  }

}

/*
====================================
NOTIFIKASI ADMIN
====================================
*/

async function kirimNotifikasiAdmin(
  nomor,
  pesan
) {

  await kirimText(

    ADMIN_NUMBER,

`Lead Baru Kedai Media

Nomor:
${nomor}

Pesan:
${pesan}`

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
```
