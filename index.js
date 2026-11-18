// ============================================================
//  ZUAN STORE - BOT WHATSAPP
//  OWNER : 6281514262038
//  FITUR : MENU, HARGA, RESELLER, VPS, PAYMENT, ORDER OTOMATIS
//  LOGIN : QR DI WEB! NO PAIRING CODE!
//  WEB QR: https://zuan-bot.fadehost.app
// ============================================================

let makeWASocket, useMultiFileAuthState, DisconnectReason;

try {
  ({
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
  } = require('@whiskeysockets/baileys'));
} catch (e) {
  console.log('ERROR Baileys belum ke-install!');
  console.log(e.message);
  process.exit(1);
}

const fs = require('fs');
const http = require('http');
const QRCode = require('qrcode');

const OWNER = '6281514262038';

const logger = {
  level: 'silent',
  child: () => logger,
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {}
};

let currentQR = null;
let lastQRImg = '';
let botStatus = 'Lagi nyari QR... Tunggu bentar...';

const server = http.createServer((req, res) => {
  let qrImg = '';
  if (lastQRImg) {
    qrImg = `<img src="${lastQRImg}" style="border:10px solid white;border-radius:20px;width:90vw;max-width:350px;">`;
  } else {
    qrImg = `<h2 style="color:white;">${botStatus}</h2>`;
  }
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>ZUAN STORE - QR LOGIN</title>
    <meta http-equiv="refresh" content="5">
  </head>
  <body style="background:#0f0f0f;font-family:sans-serif;text-align:center;padding:20px;color:white;">
    <h1 style="font-size:28px;">⚡ ZUAN STORE ⚡</h1>
    <p style="color:#aaa;">Status: ${botStatus}</p>
    <p>Scan QR di bawah ini pake WA lu!</p>
    ${qrImg}
    <p style="color:#888;margin-top:20px;font-size:13px;">
      Halaman ini auto-refresh tiap 5 detik<br>
      WA > Titik 3 > Perangkat Tertaut > Tautkan Perangkat > Scan QR
    </p>
    <p style="color:#25D366;font-weight:bold;">Owner: wa.me/6281514262038</p>
  </body>
  </html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// INI YANG GUE BENERIN! WAJIB 0.0.0.0 BIAR FADEHOST BISA DENGER!
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log('Web QR jalan di port ' + PORT);
});

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    auth: state,
    logger: logger,
    browser: ['Zuan Store', 'Chrome', '1.0'],
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      currentQR = qr;
      lastQRImg = await QRCode.toDataURL(qr, { width: 800, margin: 2 });
      botStatus = 'QR BARU MUNCUL! Buka https://zuan-bot.fadehost.app & scan!';
      console.log('QR BARU! Buka https://zuan-bot.fadehost.app');
    }
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log('Koneksi putus, kode:', statusCode);
      if (statusCode === 401 || statusCode === DisconnectReason.loggedOut) {
        console.log('SESSION MATI! Hapus session mati, bikin QR baru...');
        try { fs.rmSync('session', { recursive: true, force: true }); } catch (e) {}
        currentQR = null;
        lastQRImg = '';
        botStatus = 'Session lama mati, lagi bikin QR baru... Buka web!';
        setTimeout(() => start(), 3000);
        return;
      }
      botStatus = 'Reconnect... Tunggu bentar, jangan scan ulang dulu!';
      setTimeout(() => start(), 5000);
    }
    if (connection === 'open') {
      currentQR = null;
      lastQRImg = '';
      botStatus = 'BOT NYAMBUNG! GACOR!';
      console.log('NYAMBUNG! BOT ZUAN STORE GACOR!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    try {
      if (type !== 'notify') return;
      const m = messages[0];
      if (!m.message) return;
      if (m.key.fromMe) return;
      const from = m.key.remoteJid;
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || '';
      console.log('📩 CHAT MASUK dari ' + from + ' : ' + body);
      if (!body) return;
      const senderName = m.pushName || 'Customer';
      const senderNum = from.split('@')[0];
      const reply = (text) => sock.sendMessage(from, { text: text }, { quoted: m });
      const lower = body.toLowerCase();

      if (lower.includes('nama:') && lower.includes('panel:')) {
        await reply('🔥 *ORDER MASUK BOSSKU!* 🔥\n━━━━━━━━━━━━━━━━━━\n✅ *STATUS: SEDANG DIPROSES* ⏳\n\nYo ' + senderName + '! Order lu udah nyangkut di sistem gue nih!\n\n📋 *DETAIL ORDER LU:*\n' + body + '\n\n━━━━━━━━━━━━━━━━━━\n💳 *NEXT STEP:*\n1. Ketik .payment - Liat cara bayar\n2. Transfer - Sesuai harga\n3. Kirim bukti TF - Di sini aja\n4. Tunggu 1-5 Menit - Panel langsung jadi! ⚡\n\nOwner: wa.me/6281514262038');
        try {
          await sock.sendMessage(OWNER + '@s.whatsapp.net', { text: '🚨 *ADA ORDER BARU CUAN!* 🚨\nDari: ' + senderName + ' (' + senderNum + ')\nWaktu: ' + new Date().toLocaleString('id-ID') + '\n\n📋 *FORMAT ORDER:*\n' + body + '\n\nGas garap bang!\nwa.me/' + senderNum });
        } catch (e) { console.log('Gagal kirim ke owner', e); }
        return;
      }

      if (!body.startsWith('.')) return;
      const args = body.slice(1).trim().split(/ +/);
      const cmd = args.shift().toLowerCase();
      console.log('⚡ CMD: ' + cmd + ' dari ' + senderNum);

      if (cmd === 'ping') {
        return reply('⚡ *ZUAN STORE ONLINE BOS!* ⚡\n\n🏓 Pong! Bot masih idup, masih gacor!\nSpeed: Ngebut kaya RX King! 🔥');
      }

      if (cmd === 'menu') {
        await reply('╭━━━ *ZUAN STORE* ━━━╮\n┃ ⚡ *THE REAL PANEL STORE* ⚡\n╰━━━━━━━━━━━━━━━━━╯\n\n😈 *GAS PILIH, JANGAN CUMA LIAT!*\n\n🔥 *PANEL & HARGA*\n├ .listharga - Harga Panel Gacor\n├ .reseller - Jadi Sultan Panel\n├ .vps - VPS Murah Meriah\n├ .payment - Bayar Di Sini\n├ .garansi - Garansi Anti Rungkad\n└ .rules - Rules, Baca Biar Gak Kena Ban!\n\n🛒 *ORDER*\n├ .buy - Cara Order Anti Ribet\n└ .panel - Info Panel\n\n🎲 *FUN*\n├ .jodoh - Cek Jodoh Lu\n├ .quotes - Quotes Buat Status\n└ .ping - Cek Bot Masih Idup?\n\n━━━━━━━━━━━━━━━━━━\n👑 *OWNER:* wa.me/6281514262038');
        return reply('👑 *MAU JADI SULTAN? JADI RESELLER!* 👑\n\nKetik .reseller sekarang!\n\nReseller - 10K\nAdmin - 20K\nPartner - 30K\nOwner - 45K\n\nModal kecil, cuan gede! Gas! 🔥');
      }

      if (cmd === 'role' || cmd === 'rolepanel' || cmd === 'reseller' || cmd === 'resellerpanel' || cmd === 'legal') {
        return reply('👑 *ROLE PANEL LEGAL - ZUAN STORE* 👑\n━━━━━━━━━━━━━━━━━━\n*BUKAN PANEL ABAL-ABAL, INI LEGAL 100%!*\n\n💎 RESELLER - *10K*\n💎 ADMIN PANEL - *20K*\n💎 PARTNER PANEL - *30K*\n💎 OWNER PANEL - *45K*\n\n━━━━━━━━━━━━━━━━━━\n*<> BENEFIT GILA-GILAAN <>*\n\n🔥 *RESELLER LEGAL* 🔥\n— Bisa Jualan Panel 1GB - UNLI\n— Create Panel Sepuasnya\n— Free VPS x1\n— Dijamin Diurus 100%\n— PTPT Perbulan\n\n😈 *ADMIN LEGAL* 😈\n— Akses Open Reseller Panel\n— Akses PLTA & PLTC\n— Akses Create Panel 1GB - UNLI\n— Create Panel Sepuasnya\n— Free VPS x1\n— Dijamin Diurus 100%\n— PTPT Perbulan\n\n🚀 *PARTNER LEGAL* 🚀\n— Akses Open Admin Panel Legal\n— Akses Open Reseller Panel Legal\n— Akses PLTA & PLTC\n— Akses Create Panel 1GB - UNLI\n— Create Panel Sepuasnya\n— Free VPS x2\n— Dijamin Diurus 100%\n— PTPT Perbulan\n\n👑 *OWNER LEGAL - RAJA NYA!* 👑\n— Akses PENUH Ke Server\n— Akses Open Partner Legal\n— Akses Open Admin Panel Legal\n— Akses Open Reseller Legal\n— Akses Create Panel 1GB - UNLI\n— Create Panel Sepuasnya\n— Free VPS x3\n— Dijamin Diurus 100%\n— PTPT Perbulan\n\n━━━━━━━━━━━━━━━━━━\n*<> SPESIFIKASI SERVER - MONSTER! <>*\n\n🖥️ *SERVER V1*\n- OS: Ubuntu 24.04.3 x86_64\n- CPU: Intel Xeon E5-2690 v4 @ 2.50GHz (16 core)\n- RAM: 64GB\n- DISK: 540 GB NVMe\n- NETWORK: 1 Gbps\n- LOCATION: Indonesia\n\n🖥️ *SERVER V2*\n- OS: Ubuntu 24.04.3 x86_64\n- CPU: AMD EPYC-Turin (8) 2.84 GHz\n- RAM: 32GB\n- DISK: 480GB NVMe\n- NETWORK: 1 Gbps\n\n━━━━━━━━━━━━━━━━━━\nGas join? Chat Owner!\n👑 wa.me/6281514262038');
      }

      if (cmd === 'listharga') {
        return reply('⚡ *LIST HARGA PANEL - ZUAN STORE* ⚡\n━━━━━━━━━━━━━━━━━━\n*HARGA MURAH, KUALITAS SULTAN!*\n\n🔥 *PANEL PRIVATE - ANTI LAG!*\n⚡ 1GB - Rp 4.000 /bln\n⚡ 2GB - Rp 6.000 /bln\n⚡ 3GB - Rp 8.000 /bln\n⚡ 4GB - Rp 10.000 /bln\n⚡ 5GB - Rp 12.000 /bln\n⚡ 6GB - Rp 14.000 /bln\n⚡ 7GB - Rp 16.000 /bln\n⚡ 8GB - Rp 18.000 /bln\n⚡ 9GB - Rp 20.000 /bln\n⚡ 10GB - Rp 22.000 /bln\n👑 UNLI - Rp 25.000 /bln\n✅ Garansi: 30 Hari\n\n💣 *PANEL PUBLIC - MURAH MERIAH!*\n💥 1GB - Rp 2.000 /bln\n💥 2GB - Rp 4.000 /bln\n💥 3GB - Rp 6.000 /bln\n💥 4GB - Rp 8.000 /bln\n💥 5GB - Rp 10.000 /bln\n👑 UNLI - Rp 15.000 /bln\n✅ Garansi: 15 Hari\n\n━━━━━━━━━━━━━━━━━━\n🖥️ *SPEK DEWA:* CPU 100% - 200% | Server Singapore / Germany | Uptime 99.9%\n\nMau jadi Reseller? Ketik .reseller\nOwner: wa.me/6281514262038');
      }

      if (cmd === 'payment') {
        return reply('💳 *PEMBAYARAN - ZUAN STORE* 💳\n━━━━━━━━━━━━━━━━━━\n*TF DULU, BARU PANEL JADI!*\n\n💸 DANA: *085872257850*\n💸 GOPAY: *085872257850*\n📱 QRIS: *Chat Owner*\n\n━━━━━━━━━━━━━━━━━━\n⚠️ *ABIS TF WAJIB:* Kirim bukti TF di sini!\nOwner: wa.me/6281514262038\n*GAS TF, GAS JADI!* 🔥');
      }

      if (cmd === 'garansi') {
        return reply('🛡️ *GARANSI - ZUAN STORE* 🛡️\n━━━━━━━━━━━━━━━━━━\n🔥 PANEL PRIVATE: *Garansi 30 Hari*\n💣 PANEL PUBLIC: *Garansi 15 Hari*\n\nSyarat: Panel kehapus / error dari server + Screenshot bukti + Chat owner\nOwner: wa.me/6281514262038');
      }

      if (cmd === 'rules') {
        return reply('📜 *RULES - ZUAN STORE* 📜\n━━━━━━━━━━━━━━━━━━\n1. No Spam / No Rusuh\n2. Dilarang Share Panel Ke Orang Lain\n3. Dilarang DDOS / Mining / Abuse - Auto Ban!\n4. Garansi Hangus Jika Melanggar Rules\n5. Wajib Kirim Bukti TF Sebelum Panel Dibuat\n\n*LANGGAR = BAN TANPA REFUND! NO DRAMA!* 😈');
      }

      if (cmd === 'vps') {
        return reply('🖥️ *LIST VPS - ZUAN STORE* 🖥️\n━━━━━━━━━━━━━━━━━━\n*<> PROMO DAY ONE <>*\n\n🔥 VPS DIGITALOCEAN START *3K AN*\n🔥 VPS LINODE START *6K AN*\n💣 DIGITALOCEAN 10 DROP HANYA *35K*\n💣 DIGITALOCEAN 3 DROP HANYA *25K*\n💎 LINODE FT $100/$500 HANYA *60K*\n\n━━━━━━━━━━━━━━━━━━\n*ORDER? DIMARI!*\nOwner: wa.me/6281514262038\nKetik .payment buat pembayaran!\n*SIAPA CEPAT DIA DAPAT!* 🚀');
      }

      if (cmd === 'buy' || cmd === 'order') {
        return reply('🛒 *CARA ORDER - GAMPANG PARAH!* 🛒\n━━━━━━━━━━━━━━━━━━\n1. Pilih panel yang lu mau Contoh: *5GB Private*\n2. Copy format ini:\n\n*FORMAT ORDER:*\nNama:\nPanel: 5GB Private\nNo WA:\n\n3. Transfer ke .payment\n4. Kirim bukti TF\n5. *Panel langsung jadi! 1-5 Menit!* ⚡\n\nOwner: wa.me/6281514262038\nKetik .listharga / .reseller / .vps');
      }

      if (cmd === 'panel') {
        return reply('⚡ *INFO PANEL - ZUAN STORE* ⚡\nPanel Pterodactyl, Anti Lag, Server Singapore / Germany.\nCek Harga: .listharga\nJadi Sultan: .reseller\nCek VPS: .vps\nBayar: .payment\nOrder: wa.me/6281514262038');
      }

      if (cmd === 'jodoh') {
        const persen = Math.floor(Math.random() * 100);
        let pesan = '';
        if (persen > 70) { pesan = '🔥 WAH GILA! JODOH BANGET NIH! GAS NIKAH!'; }
        else if (persen > 40) { pesan = '😏 LUMAYAN! Perjuangin dikit lagi!'; }
        else { pesan = '💀 WADUH! Kayanya bukan jodoh lu nih...'; }
        return reply('💘 *CEK JODOH - ZUAN STORE* 💘\nKecocokan Lu: *' + persen + '%*\n' + pesan + '\n\nKetik .listharga buat cek panel!');
      }

      if (cmd === 'quotes') {
        const q = [
          'Jangan menyerah, panel murah masih banyak. Yang nyerah, yang rungkad!',
          'Sukses itu butuh proses, bukan protes. Gas kerja!',
          'Hidup itu pilihan, pilih panel di Zuan Store!',
          'Kerja keras + Doa = Sukses. Cuan ngalir terus!',
          'Modal 2rb udah bisa punya panel. Gas mulai!'
        ];
        const randomQ = q[Math.floor(Math.random() * q.length)];
        return reply('💬 *QUOTES BADASS* 💬\n"' + randomQ + '"\n\n- Zuan Store 🔥');
      }

    } catch (err) {
      console.log('❌ ERROR BALAS CHAT:', err.message);
    }
  });
}

start();
