const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');

// Biar Fadehost gak ngira bot mati
http.createServer((req, res) => res.end('Zuan Bot Online!')).listen(process.env.PORT || 8080, () => {
    console.log('Web server jalan di port', process.env.PORT || 8080);
});

const NOMOR_BOT = "6281514262038";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Zuan-Bot", "Chrome", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    // === PAIRING CODE MODE ===
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(NOMOR_BOT);
                console.log("========================================");
                console.log("PAIRING CODE LU: " + code);
                console.log("MASUKIN DI WA > PERANGKAT TERTAUT > TAUTKAN DENGAN NOMOR");
                console.log("========================================");
            } catch (e) {
                console.log("Gagal minta pairing code:", e.message);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi putus, reconnect...', shouldReconnect);
            if (shouldReconnect) startBot();
            else console.log('Logout! Hapus folder session dan pairing ulang.');
        } else if (connection === 'open') {
            console.log('✅ ZUAN BOT UDAH NYAMBUNG!');
        }
    });

    // === PESAN MASUK ===
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

            console.log(`Pesan dari ${from}: ${text}`);

            if (text.toLowerCase() === '.ping' || text.toLowerCase() === 'ping') {
                await sock.sendMessage(from, { text: 'Pong! 🏓 Zuan Bot Online!' });
            }
            if (text.toLowerCase() === '.menu' || text.toLowerCase() === 'menu') {
                await sock.sendMessage(from, { text: `*MENU ZUAN BOT*\n\n.ping - Cek bot hidup\n.menu - Menu ini\n\nBot by Zuan - Pairing Code Mode` });
            }
            if (text.toLowerCase() === 'halo' || text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
                await sock.sendMessage(from, { text: 'Halo! 👋 Gue Zuan Bot, ketik .menu buat liat menu!' });
            }

        } catch (e) {
            console.log('Error pesan:', e.message);
        }
    });
}

startBot();
