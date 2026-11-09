const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

const OWNER = '6281514262038';

async function start(){
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Zuan Store', 'Chrome', '1.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === 'close'){
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Koneksi putus, reconnect...', shouldReconnect);
      if(shouldReconnect) start();
    } else if(connection === 'open'){
      console.log('✅ NYAMBUNG!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if(!m.message || m.key.fromMe) return;
    const from = m.key.remoteJid;
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const senderName = m.pushName || 'Customer';
    const senderNum = from.split('@')[0];
    const reply = (text) => sock.sendMessage(from, { text: text }, { quoted: m });

    // === AUTO DETEKSI FORMAT ORDER - BADASS VERSION ===
    const lower = body.toLowerCase();
    if(lower.includes('nama:') && lower.includes('panel:')){
      await reply(
`🔥 *ORDER MASUK BOSSKU!* 🔥
━━━━━━━━━━━━━━━━━━
✅ *STATUS: SEDANG DIPROSES* ⏳

Yo ${senderName}! Order lu udah nyangkut di sistem gue nih! Gak bakal gue cuekin!

📋 *DETAIL ORDER LU:*
${body}

━━━━━━━━━━━━━━━━━━
💳 *NEXT STEP - JANGAN DI SKIP!*
1. Ketik *.payment* - Liat cara bayar
2. Transfer - Sesuai harga, jangan kurang!
3. Kirim bukti TF - Di sini aja
4. Tunggu 1-5 Menit - Panel langsung jadi! ⚡

Sabar dikit ya, owner lagi ngeracik panel lu biar ngebut! 🚀
Owner: wa.me/6281514262038`
      );
      try{
        await sock.sendMessage(OWNER + '@s.whatsapp.net', { text:
`🚨 *ADA ORDER BARU CUAN!* 🚨
━━━━━━━━━━━━━━━━━━
Dari: ${senderName} (${senderNum})
Waktu: ${new Date().toLocaleString('id-ID')}

📋 *FORMAT ORDER:*
${body}

Gas garap bang! Jangan sampe kabur!
wa.me/${senderNum}`
        });
      } catch(e){ console.log('Gagal kirim ke owner', e); }
      return;
    }

    if(!body.startsWith('.')) return;
    const args = body.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    if(cmd==='ping'){
      return reply('⚡ *ZUAN STORE ONLINE BOS!* ⚡\n\n🏓 Pong! Bot masih idup, masih gacor!\nSpeed: Ngebut kaya RX King! 🔥');
    }

    if(cmd==='menu'){
      await reply(
`╭━━━ *ZUAN STORE* ━━━╮
┃ ⚡ *THE REAL PANEL STORE* ⚡
╰━━━━━━━━━━━━━━━━━╯

😈 *GAS PILIH, JANGAN CUMA LIAT!*

🔥 *PANEL & HARGA*
├ .listharga - Harga Panel Gacor
├ .reseller - Jadi Sultan Panel
├ .vps - VPS Murah Meriah
├ .payment - Bayar Di Sini
├ .garansi - Garansi Anti Rungkad
└ .rules - Rules, Baca Biar Gak Kena Ban!

🛒 *ORDER*
├ .buy - Cara Order Anti Ribet
└ .panel - Info Panel

🎲 *FUN*
├ .jodoh - Cek Jodoh Lu
├ .quotes - Quotes Buat Status
└ .ping - Cek Bot Masih Idup?

━━━━━━━━━━━━━━━━━━
👑 *OWNER:* wa.me/6281514262038
💬 *GAS CHAT, JANGAN MALU-MALU!*`
      );
      return reply(
`👑 *MAU JADI SULTAN? JADI RESELLER!* 👑

Ketik *.reseller* sekarang!

Reseller - 10K
Admin - 20K
Partner - 30K
Owner - 45K

Modal kecil, cuan gede! Gas! 🔥`
      );
    }

    if(cmd==='role' || cmd==='rolepanel' || cmd==='reseller' || cmd==='resellerpanel' || cmd==='legal'){
      return reply(
`👑 *ROLE PANEL LEGAL - ZUAN STORE* 👑
━━━━━━━━━━━━━━━━━━
*BUKAN PANEL ABAL-ABAL, INI LEGAL 100%!*

💎 RESELLER - *10K*
💎 ADMIN PANEL - *20K*
💎 PARTNER PANEL - *30K*
💎 OWNER PANEL - *45K*

━━━━━━━━━━━━━━━━━━
*<> BENEFIT GILA-GILAAN <>*

🔥 *RESELLER LEGAL* 🔥
— Bisa Jualan Panel 1GB - UNLI
— Create Panel Sepuasnya, Gak Ada Rem!
— Free VPS x1
— Dijamin Diurus 100%, Gak Ditinggal!
— PTPT Perbulan, Cuan Terus!

😈 *ADMIN LEGAL* 😈
— Akses Open Reseller Panel
— Akses PLTA & PLTC
— Akses Create Panel 1GB - UNLI
— Create Panel Sepuasnya
— Free VPS x1
— Dijamin Diurus 100%
— PTPT Perbulan

🚀 *PARTNER LEGAL* 🚀
— Akses Open Admin Panel Legal
— Akses Open Reseller Panel Legal
— Akses PLTA & PLTC
— Akses Create Panel 1GB - UNLI
— Create Panel Sepuasnya
— Free VPS x2
— Dijamin Diurus 100%
— PTPT Perbulan

👑 *OWNER LEGAL - RAJA NYA!* 👑
— Akses PENUH Ke Server, Lu Yang Pegang!
— Akses Open Partner Legal
— Akses Open Admin Panel Legal
— Akses Open Reseller Legal
— Akses Create Panel 1GB - UNLI
— Create Panel Sepuasnya
— Free VPS x3
— Dijamin Diurus 100%
— PTPT Perbulan

━━━━━━━━━━━━━━━━━━
*<> SPESIFIKASI SERVER - MONSTER! <>*

🖥️ *SERVER V1 - BEST!*
• OS: Ubuntu 24.04.3 x86_64
• CPU: Intel Xeon E5-2690 v4 @ 2.50GHz (16 core)
• RAM: 64GB - GEDE PARAH!
• DISK: 540 GB NVMe - Ngebut!
• NETWORK: 1 Gbps 🚀
• LOCATION: Indonesia 🇮🇩

🖥️ *SERVER V2 - GACOR!*
• OS: Ubuntu 24.04.3 x86_64
• CPU: AMD EPYC-Turin (8) 2.84 GHz
• RAM: 32GB
• DISK: 480GB NVMe
• NETWORK: 1 Gbps 🚀

━━━━━━━━━━━━━━━━━━
Gas join? Chat Owner sekarang!
👑 wa.me/6281514262038`
      );
    }

    if(cmd==='listharga'){
      return reply(
`⚡ *LIST HARGA PANEL - ZUAN STORE* ⚡
━━━━━━━━━━━━━━━━━━
*HARGA MURAH, KUALITAS SULTAN!*

🔥 *PANEL PRIVATE - ANTI LAG!*
━━━━━━━━━━━━━━━━━━
⚡ 1GB - Rp 4.000 /bln
⚡ 2GB - Rp 6.000 /bln
⚡ 3GB - Rp 8.000 /bln
⚡ 4GB - Rp 10.000 /bln
⚡ 5GB - Rp 12.000 /bln
⚡ 6GB - Rp 14.000 /bln
⚡ 7GB - Rp 16.000 /bln
⚡ 8GB - Rp 18.000 /bln
⚡ 9GB - Rp 20.000 /bln
⚡ 10GB - Rp 22.000 /bln
👑 UNLI - Rp 25.000 /bln
✅ Garansi: 30 Hari - Full!

💣 *PANEL PUBLIC - MURAH MERIAH!*
━━━━━━━━━━━━━━━━━━
💥 1GB - Rp 2.000 /bln
💥 2GB - Rp 4.000 /bln
💥 3GB - Rp 6.000 /bln
💥 4GB - Rp 8.000 /bln
💥 5GB - Rp 10.000 /bln
👑 UNLI - Rp 15.000 /bln
✅ Garansi: 15 Hari

━━━━━━━━━━━━━━━━━━
🖥️ *SPEK DEWA:*
CPU: 100% - 200%
RAM: Sesuai GB
Server: Singapore / Germany
Uptime: 99.9% - Gak Pernah Tidur!

Mau jadi Reseller? Ketik *.reseller*
Owner: wa.me/6281514262038`
      );
    }

    if(cmd==='payment'){
      return reply(
`💳 *PEMBAYARAN - ZUAN STORE* 💳
━━━━━━━━━━━━━━━━━━
*TF DULU, BARU PANEL JADI!*

💸 DANA: *085872257850*
💸 GOPAY: *085872257850*
📱 QRIS: *Chat Owner*

━━━━━━━━━━━━━━━━━━
⚠️ *ABIS TF WAJIB:*
Kirim bukti TF di sini!
Jangan lupa, biar langsung diproses!

Owner: wa.me/6281514262038
*GAS TF, GAS JADI!* 🔥`
      );
    }

    if(cmd==='garansi'){
      return reply(
`🛡️ *GARANSI - ZUAN STORE* 🛡️
━━━━━━━━━━━━━━━━━━
*KLAIM GAMPANG, GAK RIBET!*

🔥 PANEL PRIVATE: *Garansi 30 Hari*
💣 PANEL PUBLIC: *Garansi 15 Hari*

━━━━━━━━━━━━━━━━━━
*SYARAT KLAIM - GAMPANG:*
✓ Panel kehapus / error dari server
✓ Screenshot bukti
✓ Chat owner langsung

Owner: wa.me/6281514262038
*TENANG, PANEL LU AMAN DI TANGAN GUE!* 😎`
      );
    }

    if(cmd==='rules'){
      return reply(
`📜 *RULES - ZUAN STORE* 📜
━━━━━━━━━━━━━━━━━━
*BACA DULU, JANGAN LANGSUNG NGEYEL!*

1. ❌ No Spam / No Rusuh - Sopan dikit!
2. ❌ Dilarang Share Panel Ke Orang Lain
3. ❌ Dilarang DDOS / Mining / Abuse - Auto Ban!
4. ❌ Garansi Hangus Jika Melanggar Rules
5. ✅ Wajib Kirim Bukti TF Sebelum Panel Dibuat

━━━━━━━━━━━━━━━━━━
*LANGGAR = BAN TANPA REFUND!*
*NO DRAMA, NO BACOT!* 😈`
      );
    }

    if(cmd==='vps'){
      return reply(
`🖥️ *LIST VPS - ZUAN STORE* 🖥️
━━━━━━━━━━━━━━━━━━
*<> PROMO DAY ONE <>*
*HARGA GILA, STOK TERBATAS!*

🔥 VPS DIGITALOCEAN
START *3K AN* - Murah Parah!

🔥 VPS LINODE
START *6K AN*

💣 DIGITALOCEAN 10 DROP
HANYA *35K* - Gas Borong!

💣 DIGITALOCEAN 3 DROP
HANYA *25K*

💎 LINODE FT $100/$500
HANYA *60K* - Sultan Punya!

━━━━━━━━━━━━━━━━━━
*ORDER? DIMARI!*
Owner: wa.me/6281514262038
Ketik *.payment* buat pembayaran!
*SIAPA CEPAT DIA DAPAT!* 🚀`
      );
    }

    if(cmd==='buy' || cmd==='order'){
      return reply(
`🛒 *CARA ORDER - GAMPANG PARAH!* 🛒
━━━━━━━━━━━━━━━━━━

1. Pilih panel yang lu mau
Contoh: *5GB Private* - Gacor!

2. Copy format ini, isi, kirim ke sini:

*FORMAT ORDER:*
Nama:
Panel: 5GB Private
No WA:

3. Transfer ke *.payment*
4. Kirim bukti TF
5. *Panel langsung jadi! 1-5 Menit!* ⚡

━━━━━━━━━━━━━━━━━━
*LANGSUNG GAS!*
Owner: wa.me/6281514262038

Ketik *.listharga* - Liat harga panel
Ketik *.reseller* - Jadi Reseller
Ketik *.vps* - Liat harga VPS
*JANGAN CUMA DILIHAT, DIBELI!* 😈`
      );
    }

    if(cmd==='panel'){
      return reply(
`⚡ *INFO PANEL - ZUAN STORE* ⚡
━━━━━━━━━━━━━━━━━━
Panel Pterodactyl, Anti Lag, Server Singapore / Germany.
Ngebut, Stabil, Gak Pake Drama!

Cek Harga: *.listharga*
Jadi Sultan: *.reseller*
Cek VPS: *.vps*
Bayar: *.payment*
Order: wa.me/6281514262038

*PANEL MURAH, KUALITAS GAK MURAHAN!* 🔥`
      );
    }

    if(cmd==='jodoh'){
      const persen = Math.floor(Math.random()*100);
      return reply(
`💘 *CEK JODOH - ZUAN STORE* 💘
━━━━━━━━━━━━━━━━━━
Kecocokan Lu: *${persen}%*

${persen > 70 ? '🔥 WAH GILA! JODOH BANGET NIH! GAS NIKAH! Gas halalin sekarang!' : persen > 40 ? '😏 LUMAYAN! Perjuangin dikit lagi, jangan nyerah! Gas PDKT!' : '💀 WADUH! Kayanya bukan jodoh lu nih... Cari yang lain aja, masih banyak!'}

*Udah cek jodoh, sekarang cek panel!*
Ketik *.listharga*`
      );
    }

    if(cmd==='quotes'){
      const q = [
        'Jangan menyerah, panel murah masih banyak. Yang nyerah, yang rungkad!',
        'Sukses itu butuh proses, bukan protes. Gas kerja, jangan banyak ngeluh!',
        'Hidup itu pilihan, pilih panel di Zuan Store. Dijamin gak nyesel!',
        'Kerja keras + Doa = Sukses. Cuan ngalir terus!',
        'Jangan takut gagal, takutlah jadi beban keluarga. Gas bangkit!',
        'Modal 2rb udah bisa punya panel. Alasan apa lagi buat gak mulai?',
        'Orang sukses itu yang mulai duluan, bukan yang nunggu-nunggu. Gas!',
      ];
      return reply(
`💬 *QUOTES BADASS* 💬
━━━━━━━━━━━━━━━━━━
"${q[Math.floor(Math.random()*q.length)]}"

- Zuan Store 🔥
Ketik *.quotes* lagi buat quotes baru!`
      );
    }

  });
}

start();
