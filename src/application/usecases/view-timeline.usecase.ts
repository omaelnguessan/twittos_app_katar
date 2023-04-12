import { MessageRepository } from "../message.repository";
import { DateProvider } from "../date-provider";

const ONE_MINUTE_IN_MS = 60000;

export class ViewTimeLineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const messageOfUser = await this.messageRepository.getAllOfUser(user);
    messageOfUser.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return messageOfUser.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this.publicationTime(msg.publishedAt),
    }));
  }

  private publicationTime(publishedAt: Date): string {
    const now = this.dateProvider.getNow();
    const diff = now.getTime() - publishedAt.getTime();
    const minute = Math.floor(diff / ONE_MINUTE_IN_MS);

    if (minute < 1) {
      return "less than a minute ago";
    }

    if (minute < 2) {
      return "1 minute ago";
    }

    return `${minute} minutes ago`;
  }
}
