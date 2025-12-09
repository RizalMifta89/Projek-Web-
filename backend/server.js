require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Telegraf } = require('telegraf');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Setup Middleware
app.use(cors()); // Supaya Vercel bisa akses
app.use(express.json());

// 2. Setup Bot Telegram (Jika token ada)
let bot;
if (process.env.BOT_TOKEN) {
    bot = new Telegraf(process.env.BOT_TOKEN);
    // Setup Webhook Route untuk Telegram
    app.post('/webhook-telegram', async (req, res) => {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error');
        }
    });
}

// 3. Setup Modular Route (Sistem Copy-Paste Folder Anda)
// Import modul tiktok dari folder modules
const tiktokService = require('./modules/tiktok/index');

app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        // Panggil logika dari folder modules
        const result = await tiktokService.process(url);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Test Route (Untuk cek server nyala)
app.get('/', (req, res) => res.send('Backend is Running!'));

app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));