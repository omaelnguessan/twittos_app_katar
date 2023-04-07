import { EmptyMessageError, MessageTooLongError } from "../message";
import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessageFixture } from "./messaging.fixture";

describe("feature: editing message", () => {
  let fixture: MessagingFixture;
  beforeEach(() => {
    fixture = createMessageFixture();
  });

  describe("Rule: the text should not grant then 280 characters", () => {
    test("Alice can edit her message to a text under than 280 characters", async () => {
      const aliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .withAuthor("Alice")
        .withText("Hello woldr")
        .withPublishedAt(new Date("2023-02-18T16:40:00.000Z"));

      fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

      await fixture.thenUserEditMessage({
        messageId: "message-id",
        text: "Hello world",
      });

      fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText("Hello world").build()
      );
    });

    test("Alice can't edit her message to text grander than 280", async () => {
      const textWithLengthOf281 =
        "Lorem ipsum dolor sit amet, consectetueradipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellusviverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semperlibero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ";

      const OriginalAliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .withAuthor("Alice")
        .withText("Hello world")
        .withPublishedAt(new Date("2023-02-18T16:40:00.000Z"))
        .build();

      fixture.givenTheFollowingMessagesExist([OriginalAliceMessageBuilder]);

      await fixture.thenUserEditMessage({
        messageId: "message-id",
        text: textWithLengthOf281,
      });

      await fixture.thenMessageShouldBe(OriginalAliceMessageBuilder);

      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test("Alice can't edit her message with empty text message", async () => {
      const OriginalAliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .withAuthor("Alice")
        .withText("Hello world")
        .withPublishedAt(new Date("2023-02-18T16:40:00.000Z"))
        .build();

      fixture.givenTheFollowingMessagesExist([OriginalAliceMessageBuilder]);
      await fixture.thenUserEditMessage({
        messageId: "message-id",
        text: "",
      });

      await fixture.thenMessageShouldBe(OriginalAliceMessageBuilder);

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice can't edit her message with white space text message", async () => {
      const OriginalAliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .withAuthor("Alice")
        .withText("Hello world")
        .withPublishedAt(new Date("2023-02-18T16:40:00.000Z"))
        .build();

      fixture.givenTheFollowingMessagesExist([OriginalAliceMessageBuilder]);
      await fixture.thenUserEditMessage({
        messageId: "message-id",
        text: "  ",
      });

      await fixture.thenMessageShouldBe(OriginalAliceMessageBuilder);

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
