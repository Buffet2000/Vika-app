import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: true })); // на проде лучше указать домен
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env");
  process.exit(1);
}

function esc(s = "") {
  // для HTML parse_mode
  return String(s).replace(/[<>&]/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[m]));
}

function formatMessage(data) {
  const {
    serviceId,
    serviceTitle,
    name,
    phone,
    contact,
    childAge,
    message,
    preferredTime,
    sourceUrl,
  } = data;

  return (
    `<b>🧠 Новая заявка с сайта</b>\n\n` +
    `<b>Формат:</b> ${esc(serviceTitle || serviceId || "—")}\n` +
    (name ? `<b>Имя:</b> ${esc(name)}\n` : "") +
    (phone ? `<b>Телефон:</b> ${esc(phone)}\n` : "") +
    (contact ? `<b>Контакт:</b> ${esc(contact)}\n` : "") +
    (childAge ? `<b>Возраст ребёнка:</b> ${esc(childAge)}\n` : "") +
    (preferredTime ? `<b>Когда удобно:</b> ${esc(preferredTime)}\n` : "") +
    (message ? `\n<b>Комментарий:</b>\n${esc(message)}\n` : "") +
    (sourceUrl ? `\n<b>Страница:</b> ${esc(sourceUrl)}\n` : "")
  );
}

app.post("/api/telegram", async (req, res) => {
  try {
    const data = req.body || {};

    // минимальная валидация
    if (!data.serviceId) {
      return res.status(400).json({ ok: false, error: "serviceId is required" });
    }
    if (!data.phone && !data.contact) {
      return res.status(400).json({ ok: false, error: "phone or contact is required" });
    }

    const text = formatMessage(data);

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const tgJson = await tgRes.json();

    if (!tgJson.ok) {
      return res.status(500).json({ ok: false, error: tgJson.description || "Telegram error" });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port", process.env.PORT || 4000);
});
