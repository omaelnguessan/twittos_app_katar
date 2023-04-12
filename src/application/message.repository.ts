import { Message } from "../domaine/message";

export interface MessageRepository {
  save(message: Message): Promise<void>;
  getAllOfUser(user: string): Promise<Message[]>;
  getById(id: string): Promise<Message>;
}
