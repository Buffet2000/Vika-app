import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type BookingPayload = {
  serviceId?: string;
  serviceTitle?: string;
  service_id?: string;
  name?: string;
  contact?: string;
  childAge?: string;
  format?: string;
  city?: string;
  time?: string;
  message?: string;
  sourceUrl?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN")?.trim();
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID")?.trim();

    if (!token || !chatId) {
      return new Response(JSON.stringify({ error: "Missing TELEGRAM_* secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as BookingPayload;

    const lines = [
      "🟢 Новая заявка",
      "",
      `Услуга: ${payload.serviceTitle || payload.service_id || payload.serviceId || "—"}`,
      `Имя: ${payload.name || "—"}`,
      `Контакт: ${payload.contact || "—"}`,
      payload.childAge ? `Возраст: ${payload.childAge}` : "",
      payload.format ? `Формат: ${payload.format}` : "",
      payload.city ? `Город: ${payload.city}` : "",
      payload.time ? `Когда удобно: ${payload.time}` : "",
      payload.message ? `Сообщение: ${payload.message}` : "",
      payload.sourceUrl ? `Страница: ${payload.sourceUrl}` : "",
    ].filter(Boolean);

    const text = lines.join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!tg.ok) {
      const errText = await tg.text();
      return new Response(JSON.stringify({ error: "Telegram API error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
