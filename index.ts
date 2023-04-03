#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostsMessageUseCase,
} from "./src/post-message.usecase";
import { InMemoryMessageRepository } from "./src/InMemoryMessageRepository";
import { FileSystemMessageRepository } from "./src/message.fs";
import { ViewTimeLineUseCase } from "./src/view-timeline.usecase";

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
