import {
  DateProvider,
  EmptyMessageError,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
  PostsMessageUseCase,
} from "../post-message.usecase";

describe("Features: Posting a message", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximun of 280 characters.", () => {
    test("Alice can post a message on her timeline", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAmessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      fixture.thenPostingMessageShouldBe({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const textWithLengthOf281 =
        "Lorem ipsum dolor sit amet, consectetueradipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellusviverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semperlibero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ";

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAmessage({
        id: "message-id",
        text: textWithLengthOf281,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post an empty message", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAmessage({
        id: "message-id",
        text: "",
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
    test("Alice cannot post an message with only whitespaces", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAmessage({
        id: "message-id",
        text: "   ",
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

class InMemoryMessageRepository implements MessageRepository {
  message: Message;
  save(msg: Message): void {
    this.message = msg;
  }
}

class StubDateProvider implements DateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postsMessageUseCase = new PostsMessageUseCase(
    messageRepository,
    dateProvider
  );
  let thrownError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    whenUserPostsAmessage(postMessageCommand: PostMessageCommand) {
      try {
        postsMessageUseCase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    thenPostingMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.message);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
