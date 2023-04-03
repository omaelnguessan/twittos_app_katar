import { InMemoryMessageRepository } from "../InMemoryMessageRepository";
import { Message } from "../message";
import { StubDateProvider } from "../stub-date-provider";

import { ViewTimeLineUseCase } from "../view-timeline.usecase";

describe("Feature: View a personal timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages are show in reverse chronological order", () => {
    test("Alice can view the 2 messages she have published", async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          author: "Alice",
          text: "Hello",
          id: "message-1",
          publishedAt: new Date("2023-02-07T16:28:00.000Z"),
        },
        {
          author: "Bob",
          text: "Salut les amis",
          id: "message-2",
          publishedAt: new Date("2023-02-07T16:29:01.000Z"),
        },
        {
          author: "Alice",
          text: "Hello",
          id: "message-3",
          publishedAt: new Date("2023-02-07T16:29:00.000Z"),
        },
        {
          author: "Alice",
          text: "My last message",
          id: "message-4",
          publishedAt: new Date("2023-02-07T16:30:00.000Z"),
        },
      ]);

      fixture.givenNowIs(new Date("2023-02-07T16:30:00.000Z"));

      await fixture.whenUserSeeTheTimeLineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "less than a minute ago",
        },
        {
          author: "Alice",
          text: "Hello",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "Hello",
          publicationTime: "2 minutes ago",
        },
      ]);
    });
  });
});

const createFixture = () => {
  let timeLine: {
    author: string;
    text: string;
    publicationTime: string;
  }[];

  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const viewTimeLineUseCase = new ViewTimeLineUseCase(
    messageRepository,
    dateProvider
  );

  return {
    givenTheFollowingMessagesExist(message: Message[]) {
      messageRepository.givenExistingMessages(message);
    },
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeeTheTimeLineOf(user: string) {
      timeLine = await viewTimeLineUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) {
      expect(timeLine).toEqual(expectedTimeline);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
