const express = require("express");
const cors = require("cors");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// BANCO SIMPLES (DEMO)
const users = {};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const phone = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    // 🔥 TESTE GRÁTIS 2 DIAS
    if (!users[phone]) {
      users[phone] = {
        start: Date.now(),
        active: true
      };
    }

    const user = users[phone];
    const diffDays = (Date.now() - user.start) / (1000 * 60 * 60 * 24);

    if (diffDays > 2) {
      await sock.sendMessage(phone, {
        text: "Seu teste acabou. Assine para continuar."
      });
      return;
    }

    // 🤖 IA RESPONDENDO
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um atendente de loja simpático." },
        { role: "user", content: text }
      ]
    });

    const answer = response.choices[0].message.content;

    await sock.sendMessage(phone, { text: answer });
  });
}

startBot();

app.get("/", (req, res) => {
  res.send("Bot rodando 🚀");
});

app.listen(3000, () => console.log("Servidor rodando"));
