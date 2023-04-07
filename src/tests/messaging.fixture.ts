import { InMemoryMessageRepository } from "../InMemoryMessageRepository";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "../edit-message.usecase";
import { Message, MessageText } from "../message";
import {
  PostMessageCommand,
  PostsMessageUseCase,
} from "../post-message.usecase";
import { StubDateProvider } from "../stub-date-provider";
import { ViewTimeLineUseCase } from "../view-timeline.usecase";

export const createMessageFixture = () => {
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postsMessageUseCase = new PostsMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimeLineUseCase = new ViewTimeLineUseCase(
    messageRepository,
    dateProvider
  );

  const editMessageUseCase = new EditMessageUseCase(messageRepository);

  let thrownError: Error;
  let timeLine: {
    author: string;
    text: string;
    publicationTime: string;
  }[];

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },

    givenTheFollowingMessagesExist(message: Message[]) {
      messageRepository.givenExistingMessages(message);
    },

    async whenUserSeeTheTimeLineOf(user: string) {
      timeLine = await viewTimeLineUseCase.handle({ user });
    },

    async whenUserPostsAmessage(postMessageCommand: PostMessageCommand) {
      try {
        await postsMessageUseCase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },

    async thenUserEditMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (error) {
        thrownError = error;
      }
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

    async thenMessageShouldBe(expectedMessage: Message) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
    },

    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessageFixture>;
