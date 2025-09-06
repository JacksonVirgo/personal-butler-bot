import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
} from "discord.js";
import { InteractionContext } from "../../app/discord/context";
import { SlashCommand } from "../../app/discord/builders/commands/slashCommand";
import { Button } from "../../app/discord/builders/button";
import { CustomId } from "../../app/discord/utils/customId";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function onInteraction(i: Interaction<any>) {
  if (!i.guildId) return;

  switch (true) {
    case i.isChatInputCommand():
      return await handleSlashCommand(i as ChatInputCommandInteraction);
    case i.isButton():
      return await handleButtonInteraction(i as ButtonInteraction);
    default:
      console.log(`\x1B[31mUnknown interaction type: \x1B[34m${i.type}\x1B[0m`);
      break;
  }
}

async function handleSlashCommand(i: ChatInputCommandInteraction) {
  const slashCommand = SlashCommand.registry.get(i.commandName);
  const ctx: InteractionContext = {};

  if (!slashCommand)
    return i.reply({
      content: "This command does not exist",
      flags: ["Ephemeral"],
    });

  return await slashCommand.run(i, ctx);
}

async function handleButtonInteraction(i: ButtonInteraction) {
  const cid = CustomId.parseString(i.customId);
  const button = Button.registry.get(cid.getId());

  if (!button)
    return i.reply({
      content: "This button does not exist",
      flags: ["Ephemeral"],
    });

  await button.run(i, cid.getContext());
}
