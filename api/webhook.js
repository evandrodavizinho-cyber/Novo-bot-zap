export default async function handler(req, res) {
  const { phone, message } = req.body;

  console.log("Mensagem:", message);

  res.status(200).json({ ok: true });
}
