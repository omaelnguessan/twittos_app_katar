#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostsMessageUseCase,
} from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/message.fs";
import { ViewTimeLineUseCase } from "./src/view-timeline.usecase";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "./src/edit-message.usecase";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postsMessageUseCase = new PostsMessageUseCase(
  messageRepository,
  dateProvider
);
const viewTimeLineUseCase = new ViewTimeLineUseCase(
  messageRepository,
  dateProvider
);

const editMessageUseCase = new EditMessageUseCase(messageRepository);

const program = new Command();

program
  .version("1.0.0")
  .description("twittos social network")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action(async (user, message) => {
        const uuid = (Math.random() + 1).toString(36).substring(2);
        const postMessageCommand: PostMessageCommand = {
          id: `${uuid}`,
          text: message,
          author: user,
        };

        try {
          await postsMessageUseCase.handle(postMessageCommand);
          console.log("message poste");
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("edit")
      .argument("<messageId>", "the id message to post")
      .argument("<message>", "the new message to post")
      .action(async (messageId, message) => {
        const editMessageCommand: EditMessageCommand = {
          messageId: messageId,
          text: message,
        };

        try {
          await editMessageUseCase.handle(editMessageCommand);
          console.log("message edit");
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("view")
      .argument("<user>", "the user to view the timeline ")
      .action(async (user) => {
        try {
          const timeline = await viewTimeLineUseCase.handle({ user });
          console.table(timeline);
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
