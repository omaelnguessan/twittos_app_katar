import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()].filter((mgs) => mgs.author === user)
    );
  }

  messages = new Map<string, Message>();
  save(msg: Message): Promise<void> {
    this._save(msg);
    return Promise.resolve();
  }

  getMessageById(messageId: string) {
    return this.messages.get(messageId);
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(this._save.bind(this));
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
