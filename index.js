const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => res.end('Zuan Bot Online!')).listen(process.env.PORT || 8080);

const NOMOR_BOT = "6281514262038";
const SESSION_FOLDER = "session3"; // GANTI KE session3 BIAR BENER-BENER BARU
let udahMintaKode = false;

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

    // MINTA KODE CUMA 1 KALI, GAK DIULANG-ULANG!
    if (!sock.authState.creds.registered && !udahMintaKode) {
        udahMintaKode = true;
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(NOMOR_BOT);
                console.log("========================================");
                console.log("KODE FINAL LU (JANGAN PAKE KODE LAMA!): " + code);
                console.log("========================================");
            } catch (e) {
                console.log("Gagal minta kode: " + e.message);
                udahMintaKode = false; // Boleh coba lagi kalo emang gagal total
            }
        }, 5000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('Putus, nyambung lagi...');
                setTimeout(() => startBot(), 3000);
            } else {
                console.log('Logout, hapus session...');
                try { fs.rmSync(SESSION_FOLDER, { recursive: true, force: true }); } catch {}
                udahMintaKode = false;
                setTimeout(() => startBot(), 3000);
            }
        } else if (connection === 'open') {
            console.log('✅ ZUAN BOT UDAH NYAMBUNG!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const cmd = text.toLowerCase().trim();
            if (cmd === '.ping') await sock.sendMessage(from, { text: 'Pong! 🏓 Zuan Bot Online!' });
            if (cmd === '.menu') await sock.sendMessage(from, { text: '*MENU ZUAN BOT*\n\n.ping - Cek bot\n.menu - Menu ini' });
        } catch (e) {}
    });
}
startBot();
