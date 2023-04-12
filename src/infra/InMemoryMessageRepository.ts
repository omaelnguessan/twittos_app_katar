import { MessageRepository } from "../application/message.repository";
import { Message } from "../domaine/message";

export class InMemoryMessageRepository implements MessageRepository {
  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()]
        .filter((mgs) => mgs.author === user)
        .map((m) =>
          Message.fromData({
            id: m.id,
            author: m.author,
            text: m.text,
            publishedAt: m.publishedAt,
          })
        )
    );
  }

  messages = new Map<string, Message>();
  save(msg: Message): Promise<void> {
    this._save(msg);
    return Promise.resolve();
  }

  getById(id: string): Promise<Message> {
    return Promise.resolve(this.getMessageById(id));
  }

  getMessageById(messageId: string) {
    return this.messages.get(messageId)!;
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(this._save.bind(this));
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
