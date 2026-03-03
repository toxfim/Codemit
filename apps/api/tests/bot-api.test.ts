import { afterEach, describe, expect, test } from "bun:test";
import { BotApi } from "@codemit/bot-api";

describe("BotApi", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("sendMessage sends encoded payload to Telegram endpoint", async () => {
    let requestUrl = "";
    let requestInit: RequestInit | undefined;

    globalThis.fetch = (async (url, init) => {
      requestUrl = String(url);
      requestInit = init;
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const client = new BotApi("test-token", "https://example.org");
    await client.sendMessage({ chatId: 42, text: "hello" });

    expect(requestUrl).toBe("https://example.org/bottest-token/sendMessage");
    expect(requestInit?.method).toBe("POST");
    expect(requestInit?.headers).toEqual({
      "Content-Type": "application/x-www-form-urlencoded",
    });
    expect((requestInit?.body as URLSearchParams).toString()).toBe(
      "chat_id=42&text=hello",
    );
  });

  test("sendDocument sends multipart payload", async () => {
    let requestUrl = "";
    let requestInit: RequestInit | undefined;

    globalThis.fetch = (async (url, init) => {
      requestUrl = String(url);
      requestInit = init;
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const document = new File(["pdf"], "report.pdf", {
      type: "application/pdf",
    });

    const client = new BotApi("token", "https://example.org");
    await client.sendDocument({
      chatId: "100",
      document,
      caption: "Quarterly report",
    });

    expect(requestUrl).toBe("https://example.org/bottoken/sendDocument");
    expect(requestInit?.method).toBe("POST");

    const body = requestInit?.body as FormData;

    expect(body.get("chat_id")).toBe("100");
    expect((body.get("document") as File).name).toBe("report.pdf");
    expect(body.get("caption")).toBe("Quarterly report");
  });
});
