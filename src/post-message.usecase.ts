export type Message = {
  id: string;
  text: string;
  author: string;
  publishedAt: Date;
};

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export interface MessageRepository {
  save(message: Message): void;
}

export interface DateProvider {
  getNow(): Date;
}

export class MessageTooLongError extends Error {}

export class EmptyMessageError extends Error {}

export class PostsMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(postMessageCommand: PostMessageCommand) {
    if (postMessageCommand.text.length > 200) {
      throw new MessageTooLongError();
    }

    if (postMessageCommand.text.trim().length === 0) {
      throw new EmptyMessageError();
    }

    this.messageRepository.save({
      id: postMessageCommand.id,
      text: postMessageCommand.text,
      author: postMessageCommand.author,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
