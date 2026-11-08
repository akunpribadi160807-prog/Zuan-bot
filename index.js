const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');
let qrTerbaru = "";
http.createServer((req,res)=>{
  if(qrTerbaru){res.writeHead(200,{'Content-Type':'text/html'});res.end(`<html><body style="text-align:center;background:#111;color:white;"><h1>SCAN QR ZUAN BOT!</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrTerbaru)}" /><br><br><button onclick="location.reload()">REFRESH QR</button></body></html>`)} else res.end('Zuan Bot Online! ✅');
}).listen(process.env.PORT || 8080);

const BOT_NAME = "ZUAN STORE";
const OWNER = "6281514262038";
const PREFIX = ".";

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('sessionQR');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({version, logger:pino({level:'silent'}), printQRInTerminal:false, auth:state, browser:["Zuan-Bot","Chrome","1.0.0"]});
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update',(u)=>{
    const {connection, lastDisconnect, qr} = u;
    if(qr) qrTerbaru = qr;
    if(connection==='close'){ const c=lastDisconnect?.error?.output?.statusCode; if(c!==DisconnectReason.loggedOut) setTimeout(()=>startBot(),3000); }
    else if(connection==='open'){ console.log('✅ NYAMBUNG!'); qrTerbaru=""; }
  });

  sock.ev.on('messages.upsert', async ({messages})=>{
    try{
      const msg=messages[0];
      if(!msg.message || msg.key.fromMe) return;
      const from=msg.key.remoteJid;
      const pushName=msg.pushName||"Kak";
      const text=msg.message.conversation||msg.message.extendedTextMessage?.text||msg.message.imageMessage?.caption||"";
      if(!text.startsWith(PREFIX)) return;
      const args=text.slice(1).trim().split(/ +/);
      const cmd=args.shift().toLowerCase();
      const q=args.join(" ");
      const reply=(t)=>sock.sendMessage(from,{text:t},{quoted:msg});

      // ===== MENU UTAMA =====
      if(cmd==='menu'||cmd==='help'||cmd==='allmenu'){
        return reply(
`╭───「 *${BOT_NAME}* 」───
│ Halo *${pushName}* 👋
│ Mau beli panel? Gas!
╰───────────────

╭──「 *PANEL MENU* 」──
│ ${PREFIX}panel - Menu Panel
│ ${PREFIX}listharga - List Harga Panel
│ ${PREFIX}harga - List Harga Panel
│ ${PREFIX}buy - Cara Beli Panel
│ ${PREFIX}payment - Pembayaran
│ ${PREFIX}testi - Testimoni
╰───────────────
╭──「 *VPS MENU* 」──
│ ${PREFIX}vps - List Harga VPS
│ ${PREFIX}domain - List Harga Domain
╰───────────────
╭──「 *INFO* 」──
│ ${PREFIX}ping - Cek bot
│ ${PREFIX}owner - Owner Store
│ ${PREFIX}rules - Rules Store
│ ${PREFIX}garansi - Garansi Panel
╰───────────────
╭──「 *FUN* 」──
│ ${PREFIX}jodoh - Cek jodoh
│ ${PREFIX}slot - Slot
│ ${PREFIX}quotes - Quotes
╰───────────────

Ketik *${PREFIX}listharga* buat liat harga panel!`
        );
      }

      // ===== PANEL =====
      if(cmd==='panel'){
        return reply(
`╭──「 *MENU PANEL* 」──
│ ${PREFIX}listharga - Harga Panel
│ ${PREFIX}buy - Cara Beli
│ ${PREFIX}spek - Spek Panel
│ ${PREFIX}payment - Bayar
│ ${PREFIX}garansi - Garansi
╰───────────────

*PANEL READY 24 JAM!*
*ANTI DELAY, ANTI LAG!*
Ketik ${PREFIX}listharga`
        );
      }

      // ===== LIST HARGA PANEL - INI INTINYA! =====
      if(cmd==='listharga'||cmd==='harga'||cmd==='list'||cmd==='pricelist'){
        return reply(
`╭──「 *LIST HARGA PANEL* 」──
│ *${BOT_NAME} - PANEL PTERODACTYL*
╰───────────────

*🔥 PANEL PRIVATE - RAM BESAR 🔥*
╭─────────────────
│ 1GB  - Rp 2.000 /bln
│ 2GB  - Rp 3.000 /bln
│ 3GB  - Rp 4.000 /bln
│ 4GB  - Rp 5.000 /bln
│ 5GB  - Rp 7.000 /bln
│ 6GB  - Rp 8.000 /bln
│ 7GB  - Rp 9.000 /bln
│ 8GB  - Rp 10.000 /bln
│ 9GB  - Rp 12.000 /bln
│ 10GB - Rp 13.000 /bln
│ UNLI - Rp 15.000 /bln
╰─────────────────

*⚡ PANEL PUBLIC - MURAH MERIAH ⚡*
╭─────────────────
│ 1GB  - Rp 1.000 /bln
│ 2GB  - Rp 2.000 /bln
│ 3GB  - Rp 3.000 /bln
│ 4GB  - Rp 4.000 /bln
│ 5GB  - Rp 5.000 /bln
│ UNLI - Rp 10.000 /bln
╰─────────────────

*✅ SPEK PANEL:*
• RAM: Sesuai Pilihan
• CPU: 100% - 200%
• DISK: 100% - UNLI
• Server: Singapore / Germany
• Uptime: 99.9%
• Garansi: Full 30 Hari

*🛒 CARA BELI:*
Ketik ${PREFIX}buy

*💳 BAYAR:*
Ketik ${PREFIX}payment

*Owner: wa.me/${OWNER}*`
        );
      }

      if(cmd==='buy'||cmd==='order'){
        return reply(
`🛒 *CARA BELI PANEL*

1. Pilih panel yang lu mau
   Contoh: 5GB Private
2. Ketik format ke owner:
   
   *FORMAT ORDER:*
   Nama:
   Panel: 5GB Private
   No WA:
   
3. Transfer ke ${PREFIX}payment
4. Kirim bukti TF
5. Panel langsung dibuatin! 1-5 Menit jadi!

*LANGSUNG CHAT OWNER:*
wa.me/${OWNER}

*Ketik ${PREFIX}listharga buat liat harga lagi!*`
        );
      }

      if(cmd==='spek'){
        return reply(
`📊 *SPEK PANEL ${BOT_NAME}*

• Panel: Pterodactyl Latest
• Node: Private / Public
• Lokasi: SG / DE
• Anti Delay ✅
• Anti Lag ✅
• Anti Colong ✅
• Support: Bot WA / MC / Tele
• Garansi: 30 Hari Full!

Ketik ${PREFIX}buy buat beli!`
        );
      }

      if(cmd==='payment'){
  return reply(
`💳 *PEMBAYARAN ZUAN STORE*

DANA: 085872257850
GOPAY: 085872257850
QRIS: Chat Owner

Abis TF, kirim bukti ke owner ya!
wa.me/6281514262038`
  );
      }

      if(cmd==='vps'){
        return reply(
`🖥️ *LIST HARGA VPS*

• VPS 1GB - Rp 20.000 /bln
• VPS 2GB - Rp 35.000 /bln
• VPS 4GB - Rp 60.000 /bln
• VPS 8GB - Rp 100.000 /bln

Spek: 1-4 vCPU, SSD NVMe
Lokasi: SG / US / DE

Chat owner: wa.me/${OWNER}`
        );
      }

      if(cmd==='domain'){
        return reply(
`🌐 *LIST HARGA DOMAIN*

• .my.id - Rp 15.000 /thn
• .biz.id - Rp 20.000 /thn
• .com - Rp 130.000 /thn
• .xyz - Rp 25.000 /thn

Chat owner buat cek domain!`
        );
      }

      if(cmd==='testi') return reply(`⭐ *TESTIMONI*\n\n"Panelnya ngebut banget, gak delay!" - Budi\n"Owner fast respon, 2 menit jadi!" - Andi\n"Udah langganan 3 bulan aman!" - Rizki\n\nMau jadi testi selanjutnya? Ketik ${PREFIX}buy`);
      if(cmd==='garansi') return reply(`🛡️ *GARANSI PANEL*\n\n• Kalo panel error dari server, diganti baru!\n• Kalo panel ke-delete, dibuatin lagi gratis!\n• Kalo panel lag parah, pindah node gratis!\n• Garansi 30 hari full!\n\nSyarat: Jangan melanggar rules! Ketik ${PREFIX}rules`);
      if(cmd==='rules') return reply(`📜 *RULES STORE*\n\n1. Dilarang DDOS / ATTACK\n2. Dilarang Mining / Crypto\n3. Dilarang nyebar panel ke orang tanpa izin\n4. No refund kalo melanggar rules\n5. Wajib baca ${PREFIX}garansi\n\nMelanggar = Panel dihapus, no refund!`);
      if(cmd==='ping') return reply(`Pong! 🏓 ${BOT_NAME} Online! ✅`);
      if(cmd==='owner') return reply(`👑 *OWNER*\n\nNama: Zuan\nWA: wa.me/${OWNER}\nStore: ${BOT_NAME}\n\nFast Respon 24 Jam!`);
      if(cmd==='jodoh'){ const p=Math.floor(Math.random()*100)+1; return reply(`💘 Jodoh lu ${p}%! ${p>80?'Deket banget!':'Masih nyasar!'}`); }
      if(cmd==='slot'){ const b=['🍒','🍋','🍇','💎','⭐','🔥']; const a=b[Math.floor(Math.random()*b.length)], c=b[Math.floor(Math.random()*b.length)], d=b[Math.floor(Math.random()*b.length)]; return reply(`🎰 | ${a} | ${c} | ${d} |\n${a===c&&c===d?'JACKPOT!':'Coba lagi!'}`); }
      if(cmd==='quotes') return reply(`✨ "Jangan menyerah, panel aja bisa nyambung lagi kalo putus!"`);

    }catch(e){ console.log(e.message); }
  });
}
startBot();
