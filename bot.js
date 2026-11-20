// ==================================================
//  ZUAN STORE BOT - FULL LENGKAP 100%
//  File: bot.js (1 file doang)
//  Install:
//  npm init -y
//  npm install whatsapp-web.js qrcode-terminal
//  node bot.js
// ==================================================

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
  fs.writeFileSync('./last-qr.txt', qr);
  console.log('QR baru disimpan!');
});
client.on('ready', () => console.log('✅ BOT ZUAN STORE ONLINE!'));
client.on('auth_failure', () => console.log('❌ Gagal login, hapus folder .wwebjs_auth lalu scan ulang'));

const users = new Map();
const ADMIN_WA = '6285872257850@c.us'; // <-- GANTI NOMOR ADMIN LU DISINI

function rupiah(n) { return 'Rp ' + n.toLocaleString('id-ID'); }
function saveOrder(u) {
    const log = `${new Date().toLocaleString('id-ID')} | ${u.nama} | ${u.username || '-'} | ${u.lokasi || '-'} | ${u.os || '-'} | ${rupiah(u.harga)} | ${u.from}\n`;
    fs.appendFileSync('order.txt', log);
}

// ============ DATA ============
const VPS = {
    '1': { nama: 'VPS 1GB', harga: 30000, cpu: '1 vCPU', ram: '1GB DDR4', storage: '20GB NVMe Gen4' },
    '2': { nama: 'VPS 2GB', harga: 40000, cpu: '1 vCPU', ram: '2GB DDR4', storage: '30GB NVMe Gen4' },
    '3': { nama: 'VPS 4GB', harga: 75000, cpu: '2 vCPU', ram: '4GB DDR4', storage: '60GB NVMe Gen4' },
    '4': { nama: 'VPS 8GB', harga: 130000, cpu: '4 vCPU', ram: '8GB DDR4', storage: '100GB NVMe Gen4' },
    '5': { nama: 'VPS 12GB', harga: 195000, cpu: '6 vCPU', ram: '12GB DDR4', storage: '160GB NVMe Gen4' },
    '6': { nama: 'VPS 16GB', harga: 275000, cpu: '8 vCPU', ram: '16GB DDR4', storage: '200GB NVMe Gen4' },
};
const LOKASI = { '1': '🇩🇪 Jerman — 140ms', '2': '🇮🇩 Indonesia — 15ms', '3': '🇸🇬 Singapura — 30ms' };
const OS = { '1': 'Ubuntu 24.04 LTS', '2': 'Ubuntu 22.04 LTS', '3': 'Ubuntu 26.04 LTS' };

const PANEL = {
    '1': { nama: 'PANEL 1GB', harga: 5000, spek: '🧠 1GB RAM | 💾 10GB Disk | 🖥️ 40% CPU' },
    '2': { nama: 'PANEL 2GB', harga: 8000, spek: '🧠 2GB RAM | 💾 20GB Disk | 🖥️ 80% CPU' },
    '3': { nama: 'PANEL 4GB', harga: 15000, spek: '🧠 4GB RAM | 💾 40GB Disk | 🖥️ 150% CPU' },
    '4': { nama: 'PANEL UNLIMITED', harga: 30000, spek: '🧠 UNLI RAM | 💾 UNLI Disk | 🖥️ UNLI CPU' },
};
const DOMAIN = {
    '1': { nama: '.my.id', harga: 12000 },
    '2': { nama: '.xyz', harga: 15000 },
    '3': { nama: '.online', harga: 20000 },
    '4': { nama: '.store', harga: 25000 },
    '5': { nama: '.com', harga: 95000 },
    '6': { nama: '.id', harga: 180000 },
};
const JASA = {
    '1': { nama: 'INSTALL BOT WA', harga: 15000, desc: '⚡ Sampai Jalan & Online' },
    '2': { nama: 'INSTALL PANEL', harga: 20000, desc: '🛡️ Pterodactyl Full Setting' },
    '3': { nama: 'INSTALL WEB / STORE', harga: 25000, desc: '✨ Domain + SSL + Tampilan' },
    '4': { nama: 'SETTING VPS', harga: 10000, desc: '🖥️ Optimasi Biar Ngebut' },
};

// ============ TEKS ============
const MENU = `╔═════════════════════════════════╗
        ⚡✨ 𝐙𝐔𝐀𝐍 𝐒𝐓𝐎𝐑𝐄 ✨⚡
     🚀 *CEPAT. STABIL. TANPA RIBET.*
╚═════════════════════════════════╝

      👋 *Halo kak, Selamat Datang di*
          👑 *𝐙𝐔𝐀𝐍 𝐒𝐓𝐎𝐑𝐄* 👑

      Mau order apa hari ini? 😎👇

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     🛒 *DAFTAR MENU KAMI* 🛒    ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

  ╭─► [1] 💻 *VPS MURAH* — Mulai Rp 30K
  │     ╰─➤ ⚡ NVMe Gen4 | Full Root | Aktif 5 Menit
  ├─► [2] 📱 *PANEL PTERODACTYL*
  │     ╰─➤ 🎮 Buat Server Game / Bot
  ├─► [3] 🌐 *DOMAIN MURAH*
  │     ╰─➤ 🔗 .com .id .my.id .xyz dll
  ├─► [4] 🛠️ *JASA INSTALL / SETTING*
  │     ╰─➤ ⚙️ Dibantu Sampai Beres
  ╰─► [5] 💬 *HUBUNGI ADMIN*
        ╰─➤ 👨‍💻 Fast Respon 24 Jam

━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik angka nya ya kak: *1 - 5*`;

const VPS_LIST = `╔═════════════════════════════════╗
     ⚡ *𝐙𝐔𝐀𝐍 𝐒𝐓𝐎𝐑𝐄 — 𝐕𝐏𝐒 𝐌𝐔𝐑𝐀𝐇* ⚡
      🚀 NVMe Gen4 | KVM | Full Root
       ⚡ Aktif 5 Menit. Tanpa Ribet.
╚═════════════════════════════════╝

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   💎✨ *PILIH PAKET VPS KAMU* ✨💎   ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

  ╭─► 01 — *VPS 1GB* / Rp 30.000
  │     ╰─➤ 🖥️ 1 vCPU | 🧠 1GB DDR4 | 💾 20GB NVMe Gen4
  ├─► 02 — *VPS 2GB* / Rp 40.000  🔥★ *PALING LARIS* ★🔥
  │     ╰─➤ 🖥️ 1 vCPU | 🧠 2GB DDR4 | 💾 30GB NVMe Gen4
  ├─► 03 — *VPS 4GB* / Rp 75.000  ✨ *BEST VALUE* ✨
  │     ╰─➤ 🖥️ 2 vCPU | 🧠 4GB DDR4 | 💾 60GB NVMe Gen4
  ├─► 04 — *VPS 8GB* / Rp 130.000  👑 *PRO* 👑
  │     ╰─➤ 🖥️ 4 vCPU | 🧠 8GB DDR4 | 💾 100GB NVMe Gen4
  ├─► 05 — *VPS 12GB* / Rp 195.000  💪 *BEAST* 💪
  │     ╰─➤ 🖥️ 6 vCPU | 🧠 12GB DDR4 | 💾 160GB NVMe Gen4
  ╰─► 06 — *VPS 16GB* / Rp 275.000  🚀 *MONSTER* 🚀
        ╰─➤ 🖥️ 8 vCPU | 🧠 16GB DDR4 | 💾 200GB NVMe Gen4

━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik angka paket: *1 - 6*
↩️ Ketik *0* buat balik ke Menu Utama`;

const LOKASI_TXT = `╔═════════════════════════════════╗
      🌍⚡ *PILIH LOKASI SERVER* ⚡🌍
╚═════════════════════════════════╝

      📍 Lokasi ngaruh ke PING ya kak!
         Makin deket, makin ngebut! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━
  ╭─► [1] 🇩🇪 *JERMAN* — 140ms
  │     ╰─➤ ⭐ *REKOMENDASI* | Paling Stabil
  ├─► [2] 🇮🇩 *INDONESIA* — 15ms ⚡
  │     ╰─➤ 🔥 *PALING NGEBUT* | Paling Deket
  ╰─► [3] 🇸🇬 *SINGAPURA* — 30ms
        ╰─➤ ✨ *STABIL* | Buat Asia
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik *1 / 2 / 3* ya kak 👇`;

const OS_TXT = `╔═════════════════════════════════╗
     🐧 *PILIH OPERATING SYSTEM* 🐧
╚═════════════════════════════════╝
━━━━━━━━━━━━━━━━━━━━━━━━━━
  ╭─► [1] 🐧 *Ubuntu 24.04 LTS*  ⭐ *REKOMENDASI*
  │     ╰─➤ ✨ Terbaru & Paling Stabil
  ├─► [2] 🐧 *Ubuntu 22.04 LTS*
  │     ╰─➤ 🛡️ Paling Banyak Dipake
  ╰─► [3] 🐧 *Ubuntu 26.04 LTS*
        ╰─➤ 🚀 Versi Paling Baru
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik *1 / 2 / 3*`;

const PANEL_TXT = `╔═════════════════════════════════╗
        📱 *PANEL PTERODACTYL* 📱
          🎮 *SERVER GAME & BOT*
╚═════════════════════════════════╝
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       💎 *PILIH PAKET PANEL* 💎       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► 01 — *PANEL 1GB* / Rp 5.000
  │     ╰─➤ 🧠 1GB RAM | 💾 10GB Disk | 🖥️ 40% CPU
  ├─► 02 — *PANEL 2GB* / Rp 8.000 🔥 *LARIS*
  │     ╰─➤ 🧠 2GB RAM | 💾 20GB Disk | 🖥️ 80% CPU
  ├─► 03 — *PANEL 4GB* / Rp 15.000 ✨ *BEST*
  │     ╰─➤ 🧠 4GB RAM | 💾 40GB Disk | 🖥️ 150% CPU
  ╰─► 04 — *PANEL UNLIMITED* / Rp 30.000 👑
        ╰─➤ 🧠 UNLI RAM | 💾 UNLI Disk | 🖥️ UNLI CPU
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik angka paket: *1 - 4*
↩️ Ketik *0* buat balik ke Menu Utama`;

const DOMAIN_TXT = `╔═════════════════════════════════╗
          🌐 *DOMAIN MURAH* 🌐
       🔗 *NAMA KEREN BUAT WEB LU*
╚═════════════════════════════════╝
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       💎 *LIST HARGA DOMAIN* 💎       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► [1] *.my.id* — Rp 12.000 /tahun
  ├─► [2] *.xyz* — Rp 15.000 /tahun
  ├─► [3] *.online* — Rp 20.000 /tahun
  ├─► [4] *.store* — Rp 25.000 /tahun
  ├─► [5] *.com* — Rp 95.000 /tahun
  ╰─► [6] *.id* — Rp 180.000 /tahun
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik *1 - 6* buat pilih ekstensi
↩️ Ketik *0* buat balik ke Menu Utama`;

const JASA_TXT = `╔═════════════════════════════════╗
     🛠️ *JASA INSTALL / SETTING* 🛠️
        ⚙️ *DIBANTU SAMPAI BERES*
╚═════════════════════════════════╝
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃        💎 *PILIH JASA KAMU* 💎        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► [1] 🤖 *INSTALL BOT WA* — Rp 15.000
  │     ╰─➤ ⚡ Sampai Jalan & Online
  ├─► [2] 🎮 *INSTALL PANEL* — Rp 20.000
  │     ╰─➤ 🛡️ Pterodactyl Full Setting
  ├─► [3] 🌐 *INSTALL WEB / STORE* — Rp 25.000
  │     ╰─➤ ✨ Domain + SSL + Tampilan
  ╰─► [4] 🔧 *SETTING VPS* — Rp 10.000
        ╰─➤ 🖥️ Optimasi Biar Ngebut
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik *1 - 4*
↩️ Ketik *0* buat balik ke Menu Utama`;

const ADMIN_TXT = `╔═════════════════════════════════╗
          💬 *HUBUNGI ADMIN* 💬
╚═════════════════════════════════╝
     Butuh bantuan? Santai, admin kita
           fast respon kok! 😎👇
  ╭─► 👨‍💻 *ADMIN* : Zuan
  ├─► ⏰ *ONLINE* : 24 Jam
  ├─► ⚡ *RESPON* : 1 - 5 Menit
  ╰─► 📱 *WA* : Ketik *ADMIN* biar langsung disambungin
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Ketik *ADMIN* buat chat admin
↩️ Ketik *0* buat balik ke Menu Utama`;

function bayarTxt(u) {
    return `╔═════════════════════════════════╗
    ✅🔒 *ORDER BERHASIL DIKUNCI* 🔒✅
╚═════════════════════════════════╝
     Terima kasih sudah order di
         👑⚡ *𝐙𝐔𝐀𝐍 𝐒𝐓𝐎𝐑𝐄* ⚡👑

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃         💻 *SPEK ORDER KAMU* 💻         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► 📦 *PAKET* ╰─➤ ${u.nama}
  ${u.cpu ? `├─► 🖥️ *CPU* ╰─➤ ${u.cpu}\n` : ''}${u.ram ? `  ├─► 🧠 *RAM* ╰─➤ ${u.ram}\n` : ''}${u.storage ? `  ├─► 💾 *STORAGE* ╰─➤ ${u.storage}\n` : ''}${u.lokasi ? `  ├─► 📍 *LOKASI* ╰─➤ ${u.lokasi}\n` : ''}${u.os ? `  ├─► 🐧 *OS* ╰─➤ ${u.os}\n` : ''}${u.detail ? `  ├─► 📝 *DETAIL* ╰─➤ ${u.detail}\n` : ''}  ├─► 👤 *USERNAME* ╰─➤ ${u.username || '-'}
  ├─► 🔑 *PASSWORD* ╰─➤ Dikirim setelah bayar
  ╰─► 📅 *DURASI* ╰─➤ 30 Hari Full

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       💰 *TOTAL PEMBAYARAN* 💰       ┃
┃            *${rupiah(u.harga)}*              ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       💳 *METODE : TRANSFER* 💳       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► 🏦 *SEABANK*
  │     ├─➤ No. Rek : 9012-4214-5662
  │     ╰─➤ A.N : MUHAMAD IKHSANDI AKBAR
  ├─► 📱 *GOPAY*
  │     ├─➤ No. HP : 0858-7225-7850
  │     ╰─➤ A.N : MUHAMAD IKHSANDI AKBAR
  ╰─► ⚠️ *DANA — SEDANG ADA KENDALA* ⚠️
        ╰─➤ Mohon pakai QRIS / Seabank / Gopay dulu ya

╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃         📷 *METODE : QRIS* 📷         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
  ╭─► 👉 Ketik : *Qris*
  ╰─► Agar muncul QRIS nya

━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 Setelah transfer, kirim bukti ke sini ya.
⚡ Order akan aktif 5-10 menit.`;
}

// ============ LOGIC ============
client.on('message', async msg => {
    if (msg.fromMe) return;
    const chatId = msg.from;
    const text = msg.body.trim();
    const lower = text.toLowerCase();

    if (!users.has(chatId)) users.set(chatId, { step: 'menu', from: chatId });
    const u = users.get(chatId);

    // Global: balik menu
    if (lower === 'menu' || lower === '0' || ['halo','hi','p','assalamualaikum','hello'].includes(lower)) {
        u.step = 'menu'; return msg.reply(MENU);
    }
    if (lower === 'admin') {
        u.step = 'chat_admin';
        client.sendMessage(ADMIN_WA, `🔔 Ada cust minta admin! Nomor: ${chatId} | Pesan terakhir: ${text}`);
        return msg.reply('✅ Oke kak, admin sudah dihubungi! Tunggu sebentar ya, admin akan chat kakak langsung 🙏\nKetik *MENU* buat balik.');
    }

    // Jika lagi chat admin, teruskan ke admin
    if (u.step === 'chat_admin') {
        client.sendMessage(ADMIN_WA, `💬 Chat dari ${chatId}:\n${text}`);
        return msg.reply('📨 Pesan diteruskan ke admin ya kak...');
    }

    // MENU
    if (u.step === 'menu') {
        if (text === '1') { u.step = 'pilih_vps'; u.tipe = 'VPS'; return msg.reply(VPS_LIST); }
        if (text === '2') { u.step = 'pilih_panel'; u.tipe = 'PANEL'; return msg.reply(PANEL_TXT); }
        if (text === '3') { u.step = 'pilih_domain'; u.tipe = 'DOMAIN'; return msg.reply(DOMAIN_TXT); }
        if (text === '4') { u.step = 'pilih_jasa'; u.tipe = 'JASA'; return msg.reply(JASA_TXT); }
        if (text === '5') { u.step = 'admin_info'; return msg.reply(ADMIN_TXT); }
        return msg.reply(MENU);
    }
    if (u.step === 'admin_info') return msg.reply(ADMIN_TXT);

    // --- VPS FLOW ---
    if (u.step === 'pilih_vps') {
        if (VPS[text]) { Object.assign(u, VPS[text]); u.step = 'pilih_lokasi'; return msg.reply(LOKASI_TXT); }
        return msg.reply(VPS_LIST);
    }
    if (u.step === 'pilih_lokasi') {
        if (LOKASI[text]) { u.lokasi = LOKASI[text]; u.step = 'pilih_os'; return msg.reply(OS_TXT); }
        return msg.reply(LOKASI_TXT);
    }
    if (u.step === 'pilih_os') {
        if (OS[text]) {
            u.os = OS[text]; u.step = 'konfirmasi_vps';
            return msg.reply(`╔═════════════════════════════════╗\n     🧾✨ *RINGKASAN ORDER KAMU* ✨🧾\n╚═════════════════════════════════╝\n\n  ╭─► 📦 *PAKET* ╰─➤ ${u.nama}\n  ├─► 🖥️ *CPU* ╰─➤ ${u.cpu}\n  ├─► 🧠 *RAM* ╰─➤ ${u.ram}\n  ├─► 💾 *STORAGE* ╰─➤ ${u.storage}\n  ├─► 📍 *LOKASI* ╰─➤ ${u.lokasi}\n  ├─► 🐧 *OS* ╰─➤ ${u.os}\n  ╰─► 📅 *DURASI* ╰─➤ 30 Hari Full\n\n╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n┃      💰 *TOTAL : ${rupiah(u.harga)}* 💰      ┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n⌨️ Ketik *YA* ✅ buat lanjut\n⌨️ Ketik *BATAL* ❌ kalau mau ganti`);
        }
        return msg.reply(OS_TXT);
    }
    if (u.step === 'konfirmasi_vps') {
        if (lower === 'ya') { u.step = 'username'; return msg.reply(`╔═════════════════════════════════╗\n     👤 *ATUR USERNAME VPS KAMU* 👤\n╚═════════════════════════════════╝\n\n   Tentuin username buat login VPS kamu 😎\n\n⚠️ *Syaratnya:*\n  ╭─► 🔤 Huruf kecil aja\n  ╰─► 🚫 Tanpa spasi\n\n⌨️ Ketik username kamu sekarang:`); }
        if (lower === 'batal') { u.step = 'menu'; return msg.reply(MENU); }
        return msg.reply('Ketik *YA* atau *BATAL* ya kak.');
    }

    // --- PANEL FLOW ---
    if (u.step === 'pilih_panel') {
        if (PANEL[text]) { Object.assign(u, PANEL[text]); u.detail = PANEL[text].spek; u.step = 'konfirmasi_simple'; return msg.reply(`📦 Kamu pilih *${u.nama}* - *${rupiah(u.harga)}*\n${u.detail}\n\nKetik *YA* buat lanjut ke pembayaran, *BATAL* buat ganti`); }
        return msg.reply(PANEL_TXT);
    }

    // --- DOMAIN FLOW ---
    if (u.step === 'pilih_domain') {
        if (DOMAIN[text]) { u.ekstensi = DOMAIN[text]; u.step = 'input_domain'; return msg.reply(`🌐 Kamu pilih ekstensi *${DOMAIN[text].nama}* - *${rupiah(DOMAIN[text].harga)}/tahun*\n\nKetik nama domain yang mau dicek, contoh:\n*zuanstore${DOMAIN[text].nama}*\n\n↩️ Ketik *0* buat batal`); }
        return msg.reply(DOMAIN_TXT);
    }
    if (u.step === 'input_domain') {
        u.nama = text + u.ekstensi.nama; u.harga = u.ekstensi.harga; u.detail = 'Domain ' + u.nama;
        u.step = 'konfirmasi_simple';
        return msg.reply(`✅ Domain *${u.nama}* tersedia! 🎉\n💰 Harga: *${rupiah(u.harga)}/tahun*\n\nKetik *YA* buat lanjut ke pembayaran`);
    }

    // --- JASA FLOW ---
    if (u.step === 'pilih_jasa') {
        if (JASA[text]) { Object.assign(u, JASA[text]); u.detail = JASA[text].desc; u.step = 'konfirmasi_simple'; return msg.reply(`🛠️ Kamu pilih *${u.nama}* - *${rupiah(u.harga)}*\n${u.detail}\n\nKetik *YA* buat lanjut ke pembayaran`); }
        return msg.reply(JASA_TXT);
    }

    // KONFIRMASI SIMPLE (Panel/Domain/Jasa)
    if (u.step === 'konfirmasi_simple') {
        if (lower === 'ya') { u.step = 'username'; return msg.reply('👤 Ketik username kamu (huruf kecil, tanpa spasi):'); }
        if (lower === 'batal') { u.step = 'menu'; return msg.reply(MENU); }
        return msg.reply('Ketik *YA* atau *BATAL* ya kak.');
    }

    // USERNAME (semua tipe)
    if (u.step === 'username') {
        if (!/^[a-z0-9]+$/.test(lower)) return msg.reply('⚠️ Username harus huruf kecil tanpa spasi ya kak, coba lagi:');
        u.username = lower; u.step = 'bayar'; saveOrder(u);
        // Kasih tau admin ada order baru
        client.sendMessage(ADMIN_WA, `🔔 ORDER BARU!\n📦 ${u.nama}\n💰 ${rupiah(u.harga)}\n👤 ${u.username}\n📱 Dari: ${chatId}`);
        return msg.reply(bayarTxt(u));
    }

    // BAYAR
    if (u.step === 'bayar') {
        if (lower === 'qris') {
            // Jika ada file qris.jpg di folder yang sama, kirim fotonya
            if (fs.existsSync('./qris.jpg')) {
                const media = MessageMedia.fromFilePath('./qris.jpg');
                await client.sendMessage(chatId, media, { caption: `📷 *PEMBAYARAN VIA QRIS* 📷\n\n💰 Total: *${rupiah(u.harga)}*\n👤 A.N : MUHAMAD IKHSANDI AKBAR\n\nScan QR di atas ya kak! Setelah bayar, kirim bukti ke sini 📸` });
                return;
            }
            return msg.reply(`╔═════════════════════════════════╗\n      📷 *PEMBAYARAN VIA QRIS* 📷\n╚═════════════════════════════════╝\n\n  ╭─► 💰 *${rupiah(u.harga)}*\n  ╰─► 👤 A.N : MUHAMAD IKHSANDI AKBAR\n\nQR ini bisa di scan melalui:\n💙 DANA / 💜 OVO / 💚 Gopay / 🧡 ShopeePay\natau M-Banking apa saja.\n\n📸 Setelah berhasil, kirim bukti transfernya ke sini ya kak.\n\n⚠️ *Admin belum upload foto qris.jpg, taro foto QRIS lu di folder bot dengan nama qris.jpg biar otomatis kekirim*`);
        }
        // Jika cust kirim foto bukti (ada media)
        if (msg.hasMedia) {
            u.step = 'selesai';
            client.sendMessage(ADMIN_WA, `📸 Bukti transfer dari ${chatId} untuk order ${u.nama} - ${rupiah(u.harga)}`);
            return msg.reply('✅ Bukti diterima kak! Admin lagi cek ya, VPS / order kamu akan aktif 5-10 menit setelah pembayaran dikonfirmasi ⚡\n\nTerima kasih sudah order di *ZUAN STORE* 🙏💎\nKetik *MENU* buat order lagi.');
        }
        return msg.reply('Ketik *Qris* buat dapet QRIS, atau kirim foto bukti transfernya ya kak 📸');
    }

    if (u.step === 'selesai') {
        u.step = 'menu'; return msg.reply(MENU);
    }
});

client.initialize();
