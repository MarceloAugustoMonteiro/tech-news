import { wordFromPayload } from "@/lib/translation-word";
import { translateWord, TranslationError } from "@/services/translation";

const clients = new Map<string, { count: number; until: number }>();
let total = { count: 0, until: 0 };

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Solicitação não permitida." }, { status: 403 });
  }

  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "shared";

  for (const [key, value] of clients) {
    if (value.until <= now) {
      clients.delete(key);
    }
  }

  if (total.until <= now) {
    total = { count: 0, until: now + 60000 };
  }

  const client = clients.get(ip) || { count: 0, until: now + 60000 };

  if (client.count >= 20 || total.count >= 120 || (!clients.has(ip) && clients.size >= 1000)) {
    return Response.json(
      { error: "Muitas consultas. Tente novamente em um minuto." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      },
    );
  }

  client.count++;
  total.count++;
  clients.set(ip, client);

  let payload: unknown;

  try {
    const reader = request.body?.getReader();

    if (!reader) {
      throw new Error();
    }

    const chunks: Uint8Array[] = [];
    let size = 0;

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      size += value.byteLength;

      if (size > 1024) {
        await reader.cancel();

        throw new Error();
      }

      chunks.push(value);
    }

    const bytes = new Uint8Array(size);
    let offset = 0;

    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }

    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return Response.json({ error: "Envie uma palavra válida em inglês." }, { status: 400 });
  }

  const word = wordFromPayload(payload);

  if (!word) {
    return Response.json({ error: "Envie uma palavra válida em inglês." }, { status: 400 });
  }

  try {
    const translation = await translateWord(word);

    return Response.json({ word, translation }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const limited = error instanceof TranslationError && error.limited;

    return Response.json(
      {
        error: limited
          ? "Limite de tradução atingido. Tente mais tarde."
          : "Não foi possível traduzir agora. Tente novamente.",
      },
      { status: limited ? 429 : 503 },
    );
  }
}
