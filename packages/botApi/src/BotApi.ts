export type SendMessagePayload = {
  chatId: number | string;
  text: string;
};

export type SendDocumentPayload = {
  chatId: number | string;
  document: Blob | File;
  caption?: string;
};

export class BotApi {
  private readonly baseUrl: string;

  constructor(token: string, baseUrl = "https://api.telegram.org") {
    this.baseUrl = `${baseUrl}/bot${token}`;
  }

  async sendMessage({ chatId, text }: SendMessagePayload): Promise<Response> {
    const body = new URLSearchParams({
      chat_id: String(chatId),
      text,
    });

    return fetch(`${this.baseUrl}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  }

  async sendDocument({
    chatId,
    document,
    caption,
  }: SendDocumentPayload): Promise<Response> {
    const body = new FormData();

    body.append("chat_id", String(chatId));
    body.append("document", document);

    if (caption) {
      body.append("caption", caption);
    }

    return fetch(`${this.baseUrl}/sendDocument`, {
      method: "POST",
      body,
    });
  }
}
