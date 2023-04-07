import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessageFixture } from "./messaging.fixture";

describe("Feature: View a personal timeline", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessageFixture();
  });

  describe("Rule: Messages are show in reverse chronological order", () => {
    test("Alice can view the 2 messages she have published", async () => {
      const aliceMessageBuilder = messageBuilder().withAuthor("Alice");

      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withId("message-1")
          .withText("Hello")
          .withPublishedAt(new Date("2023-02-07T16:28:00.000Z"))
          .build(),
        messageBuilder()
          .withAuthor("Bob")
          .withId("message-2")
          .withText("Salut les amis")
          .withPublishedAt(new Date("2023-02-07T16:29:01.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-3")
          .withText("Hello")
          .withPublishedAt(new Date("2023-02-07T16:29:00.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-4")
          .withText("My last message")
          .withPublishedAt(new Date("2023-02-07T16:30:00.000Z"))
          .build(),
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
