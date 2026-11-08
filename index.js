const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const { exec } = require('child_process')

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session-zuan')
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['ZuanBot', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: false,
        keepAliveIntervalMs: 10000
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) { qrcode.generate(qr, { small: true }) }
        if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode
            if (code === 401 || code === 403) {
                console.log('Logout, scan ulang!')
            } else {
                console.log('Auto nyambung lagi...', code)
                setTimeout(() => start(), 3000)
            }
        } else if (connection === 'open') {
            console.log('✅ BOT UDAH NYAMBUNG BANG!')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "").toLowerCase().trim()

        if (text === '.ping') {
            await sock.sendMessage(from, { text: 'Pong! Bot Zuan aktif bang 🔥' })
        }
        if (text === '.menu') {
            await sock.sendMessage(from, { text: `🤖 *MENU ZUAN BOT* 🤖\n\n- .ping = Cek bot aktif\n- .menu = Liat menu ini\n- .sewa = Harga sewa bot\n- .owner = Chat owner\n- .sticker = Bikin stiker dari foto\n\nCara: Kirim foto + caption .sticker\nAtau reply foto orang pake .sticker` })
        }
        if (text === '.sewa') {
            await sock.sendMessage(from, { text: `🔥 *SEWA BOT ZUAN BOT* 🔥\n\n💰 HARGA:\n- 1 HARI - 3K\n- 1 MINGGU - 10K + GRATIS 1 HARI!\n- 1 BULAN - 25K\n\nChat owner: @runjasebbot\nGas sewa sekarang!` })
        }
        if (text === '.owner') {
            await sock.sendMessage(from, { text: `Owner ZUAN BOT: @runjasebbot\nChat langsung aja bang, fast respon! 🔥` })
        }

        if (text === '.sticker' || text === '.s') {
            try {
                let imageMsg = msg.message.imageMessage
                if (!imageMsg && msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                    imageMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
                }
                if (!imageMsg) {
                    return await sock.sendMessage(from, { text: 'Kirim foto + caption .sticker bang, atau reply foto pake .sticker!' })
                }
                await sock.sendMessage(from, { text: 'Bentar bang, lagi bikin stikernya... ⏳' })
                const stream = await downloadContentFromMessage(imageMsg, 'image')
                let buffer = Buffer.from([])
                for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                fs.writeFileSync('temp.jpg', buffer)
                exec('cwebp -q 80 temp.jpg -o temp.webp', async (err) => {
                    if (err) {
                        return await sock.sendMessage(from, { text: 'Gagal bikin stiker bang, coba foto lain!' })
                    }
                    const webp = fs.readFileSync('temp.webp')
                    await sock.sendMessage(from, { sticker: webp })
                    fs.unlinkSync('temp.jpg')
                    fs.unlinkSync('temp.webp')
                })
            } catch (e) {
                console.log('Sticker error:', e)
                await sock.sendMessage(from, { text: 'Gagal bikin stiker bang, coba foto lain!' })
            }
        }
    })
}
start()
