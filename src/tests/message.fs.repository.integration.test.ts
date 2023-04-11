import * as path from "path";
import * as fs from "fs";
import { FileSystemMessageRepository } from "../message.fs";
import { messageBuilder } from "./message.builder";

const testMessagePath = path.join(__dirname, "message-test.json");

describe("FileSystemMessageRepository", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testMessagePath, JSON.stringify([]));
  });

  test("save() can save message in the filesystem", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);
    const aliceMessageBuilder = messageBuilder()
      .withId("m1")
      .withAuthor("Omael")
      .withText("Bonjour la famille")
      .withPublishedAt(new Date("2023-04-11T09:40:00.000Z"))
      .build();
    await messageRepository.save(aliceMessageBuilder);

    const messageData = await fs.promises.readFile(testMessagePath);
    const messageJson = JSON.parse(messageData.toString());
    expect(messageJson).toEqual([
      {
        id: "m1",
        author: "Omael",
        text: "Bonjour la famille",
        publishedAt: "2023-04-11T09:40:00.000Z",
      },
    ]);
  });

  test("save() can an update existing message in the filesystem", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);
    const aliceMessage = {
      id: "m1",
      author: "Omael",
      text: "Bonjour la famille",
      publishedAt: "2023-04-11T09:40:00.000Z",
    };

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([aliceMessage])
    );

    await messageRepository.save(
      messageBuilder()
        .withId("m1")
        .withAuthor("Omael")
        .withText("Bonjour la famille update")
        .withPublishedAt(new Date("2023-04-11T09:40:00.000Z"))
        .build()
    );

    const messageData = await fs.promises.readFile(testMessagePath);
    const messageJson = JSON.parse(messageData.toString());

    expect(messageJson).toEqual([
      {
        id: "m1",
        author: "Omael",
        text: "Bonjour la famille update",
        publishedAt: "2023-04-11T09:40:00.000Z",
      },
    ]);
  });

  test("getById(id) returns a message by its id", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: "m1",
          author: "Omael",
          text: "Bonjour la famille",
          publishedAt: "2023-04-11T09:40:00.000Z",
        },
        {
          id: "m2",
          author: "Omael",
          text: "Je suis heureux aujourd'hui",
          publishedAt: "2023-04-11T09:40:00.000Z",
        },
        {
          id: "m3",
          author: "Alice",
          text: "Je viens de signer mon premier gros contrat",
          publishedAt: "2023-04-11T09:40:00.000Z",
        },
      ])
    );

    const messageAlice = await messageRepository.getById("m3");

    expect(messageAlice).toEqual(
      messageBuilder()
        .withId("m3")
        .withAuthor("Alice")
        .withText("Je viens de signer mon premier gros contrat")
        .withPublishedAt(new Date("2023-04-11T09:40:00.000Z"))
        .build()
    );
  });

  test("getAllOfUser() return all messages for specific user ", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: "m1",
          author: "Omael",
          text: "Bonjour la famille",
          publishedAt: "2023-04-11T09:40:00.000Z",
        },
        {
          id: "m2",
          author: "Omael",
          text: "Je suis heureux aujourd'hui",
          publishedAt: "2023-04-11T09:41:00.000Z",
        },
        {
          id: "m3",
          author: "Alice",
          text: "Je viens de signer mon premier gros contrat",
          publishedAt: "2023-04-11T09:43:00.000Z",
        },
      ])
    );

    const allUserMessage = await messageRepository.getAllOfUser("Omael");

    expect(allUserMessage).toHaveLength(2);

    expect(allUserMessage).toEqual(
      expect.arrayContaining([
        messageBuilder()
          .withId("m1")
          .withAuthor("Omael")
          .withText("Bonjour la famille")
          .withPublishedAt(new Date("2023-04-11T09:40:00.000Z"))
          .build(),
        messageBuilder()
          .withId("m2")
          .withAuthor("Omael")
          .withText("Je suis heureux aujourd'hui")
          .withPublishedAt(new Date("2023-04-11T09:41:00.000Z"))
          .build(),
      ])
    );
  });
});
