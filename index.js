const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');
const fs = require('fs');

// Biar Fadehost gak ngira bot mati
http.createServer((req, res) => res.end('Zuan Bot Online!')).listen(process.env.PORT || 8080, () => {
    console.log('Web server jalan di port', process.env.PORT || 8080);
});

const NOMOR_BOT = "6281514262038";
const SESSION_FOLDER = "session2";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Zuan-Bot", "Chrome", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    // === PAIRING CODE - COBA TERUS SAMPE BERHASIL ===
    if (!sock.authState.creds.registered) {
        const mintaKode = async () => {
            try {
                const code = await sock.requestPairingCode(NOMOR_BOT);
                console.log("========================================");
                console.log("PAIRING CODE LU: " + code);
                console.log("WA > PERANGKAT TERTAUT > TAUTKAN DENGAN NOMOR");
                console.log("========================================");
            } catch (e) {
                console.log("Gagal minta kode, coba lagi 5 detik... " + e.message);
                setTimeout(mintaKode, 5000);
            }
        };
        setTimeout(mintaKode, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi putus, reconnect... ' + shouldReconnect + ' code: ' + statusCode);
            if (shouldReconnect) {
                setTimeout(() => startBot(), 3000);
            } else {
                // LOGOUT = HAPUS SESSION OTOMATIS, BIKIN BARU
                console.log('Logout! Hapus session lama, bikin baru...');
                try { fs.rmSync(SESSION_FOLDER, { recursive: true, force: true }); } catch {}
                setTimeout(() => startBot(), 3000);
            }
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

            const cmd = text.toLowerCase().trim();
            if (cmd === '.ping' || cmd === 'ping') {
                await sock.sendMessage(from, { text: 'Pong! 🏓 Zuan Bot Online!' });
            }
            if (cmd === '.menu' || cmd === 'menu') {
                await sock.sendMessage(from, { text: `*MENU ZUAN BOT*\n\n.ping - Cek bot hidup\n.menu - Menu ini\n\nBot by Zuan` });
            }
            if (cmd === 'halo' || cmd === 'hi' || cmd === 'hello') {
                await sock.sendMessage(from, { text: 'Halo! 👋 Gue Zuan Bot, ketik .menu buat liat menu!' });
            }
        } catch (e) {
            console.log('Error pesan:', e.message);
        }
    });
}

startBot();
