import * as path from "path";
import * as fs from "fs";
import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class FileSystemMessageRepository implements MessageRepository {
  private readonly messagePath = path.join(__dirname, "message.json");
  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();

    return messages.filter((m) => m.author === user);
  }

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();
    const existingMessageIndex = messages.findIndex(
      (msg) => msg.id === message.id
    );

    if (existingMessageIndex === -1) {
      messages.push(message);
    } else {
      messages[existingMessageIndex] = message;
    }

    return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
  }

  private async getMessages(): Promise<Message[]> {
    const data = await fs.promises.readFile(this.messagePath);
    const messages = JSON.parse(data.toString()) as {
      id: string;
      author: string;
      text: string;
      publishedAt: string;
    }[];

    return messages.map((msg) => ({
      id: msg.id,
      author: msg.author,
      text: msg.text,
      publishedAt: new Date(msg.publishedAt),
    }));
  }

  async getById(id: string): Promise<Message> {
    return (await this.getMessages()).filter((msg) => msg.id === id)[0];
  }
}
