const axios = require('axios');

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_IDS = ['1455108039']; // второй можешь закомментировать

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send("Method Not Allowed");
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
                text: message
            });
        }
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Send error" });
    }
}
