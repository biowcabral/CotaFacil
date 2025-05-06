// backend/server.js
const express = require('express');
const { sendNotification } = require('./twilio');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

app.post('/send-notification', async (req, res) => {
    const { recipients, message } = req.body;

    if (!recipients || recipients.length === 0 || !message) {
        return res.status(400).json({ success: false, error: 'Destinatários e mensagem são obrigatórios.' });
    }

    try {
        const results = await sendBulkNotifications(recipients, message);
        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error('Erro ao enviar notificações:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});