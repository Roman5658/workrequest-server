const axios = require('axios');

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_IDS = ['1455108039']; // второй можешь раскомментировать

module.exports = async (req, res) => {
    // ✅ Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Обработка preflight-запроса от браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ✅ Разрешаем только POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { name, surname, phone, date, time, comment, items } = req.body;

    const message = `
📦 Nowe zgłoszenie:
👤 Imię: ${name}
👤 Nazwisko: ${surname}
🧤 Artykuły: ${items.join(', ')}
📞 Telefon: ${phone}
📅 Data: ${date}
⏰ Godzina: ${time}
💬 Komentarz: ${comment}
`;

    try {
        for (const id of CHAT_IDS) {
            await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                chat_id: id,
                text: message,
            });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};
