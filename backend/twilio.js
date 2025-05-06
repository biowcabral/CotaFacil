const twilio = require('twilio');

// Substitua pelas suas credenciais do Twilio
const accountSid = 'AC4fd09d1895dbb967b728f06d359d126c'; // Seu Account SID
const apiKey = 'SK3951d1c8f059949d8aafcc4d9f888fb6'; // Sua API Key
const authToken = '3agoaXwuHqCfPcy7ZwUOYiZ2yNtfvK06'; // Seu Auth Token

// Crie o cliente Twilio usando o accountSid e a API Key
const client = twilio(apiKey, authToken, { accountSid });

async function sendBulkNotifications(recipients, message) {
    const results = [];
    for (const to of recipients) {
        try {
            const response = await client.messages.create({
                body: message,
                from: 'whatsapp:+14155238886', // Número do WhatsApp do Twilio (sandbox)
                to: `whatsapp:${to}`, // Número do destinatário no formato WhatsApp
            });
            console.log(`Mensagem enviada para ${to}:`, response.sid);
            results.push({ to, success: true, sid: response.sid });
        } catch (error) {
            console.error(`Erro ao enviar mensagem para ${to}:`, error);
            results.push({ to, success: false, error: error.message });
        }
    }
    return results;
}

module.exports = { sendNotification, sendBulkNotifications };