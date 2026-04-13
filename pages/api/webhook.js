export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Webhook ativo 🚀" });
  }

  if (req.method === "POST") {
    const { phone, message } = req.body;

    console.log("Mensagem recebida:", message);

    return res.status(200).json({
      reply: "Mensagem recebida com sucesso 🤖"
    });
  }

  res.status(405).json({ error: "Método não permitido" });
}
