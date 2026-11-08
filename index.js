const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');

let qrTerbaru = ""; // Simpen QR disini

// WEB SERVER BUAT NAMPILIN QR
http.createServer((req, res) => {
    if (qrTerbaru) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html><body style="text-align:center; font-family:sans-serif; background:#111; color:white;">
            <h1>SCAN QR ZUAN BOT!</h1>
            <p>QR ini auto-refresh, kalo expired refresh aja halamannya!</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrTerbaru)}" />
            <br><br><button onclick="location.reload()" style="padding:15px 30px; font-size:18px;">REFRESH QR</button>
            <p>Jangan screenshot QR ini ke orang lain!</p>
            </body></html>
        `);
    } else {
        res.end('Zuan Bot Online! Nunggu QR... Refresh lagi 5 detik!');
    }
}).listen(process.env.PORT || 8080);

async function startBot(){
    const { state, saveCreds } = await useMultiFileAuthState('sessionQR');
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        logger: pino({level:'silent'}),
        printQRInTerminal: false, // MATIIN QR DI CONSOLE BIAR GAK KEPOTONG
        auth: state,
        browser: ["Zuan-Bot","Chrome","1.0.0"]
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update',(u)=>{
        const {connection, lastDisconnect, qr} = u;
        if(qr){
            qrTerbaru = qr;
            console.log('✅ QR BARU MUNCUL! BUKA LINK WEB FADEHOST LU BUAT SCAN!');
        }
        if(connection==='close'){
            const code = lastDisconnect?.error?.output?.statusCode;
            if(code !== DisconnectReason.loggedOut) setTimeout(()=>startBot(),3000);
            else console.log('Logout, hapus sessionQR dan ulang!');
        } else if(connection==='open'){
            console.log('✅ NYAMBUNG LEWAT QR!');
            qrTerbaru = "";
        }
    });
    sock.ev.on('messages.upsert', async ({messages})=>{
        const msg=messages[0];
        if(!msg.message || msg.key.fromMe) return;
        const from=msg.key.remoteJid;
        const text=msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if(text.toLowerCase()==='.ping') await sock.sendMessage(from,{text:'Pong! 🏓 Zuan Bot Online!'});
        if(text.toLowerCase()==='.menu') await sock.sendMessage(from,{text:'*MENU ZUAN BOT*\n\n.ping - Cek bot'});
    });
}
startBot();
