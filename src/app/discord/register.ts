import { Routes, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "./builders/commands/slashCommand";
import { clientREST } from "./handler";
import config from "../../config";

export async function registerFeatures() {
  try {
    const commandList: SlashCommandBuilder[] = [];
    SlashCommand.registry.forEach((val) => {
      return commandList.push(val);
    });

    const registeredCommands = (await clientREST.put(
      Routes.applicationCommands(config.DISCORD_CLIENT_ID),
      {
        body: commandList,
      },
    )) as unknown;

    if (Array.isArray(registeredCommands)) {
      if (registeredCommands.length != commandList.length) {
        console.log(
          `\x1B[31mFailed to load ${
            commandList.length - registeredCommands.length
          } commands`,
        );
      }
    }

    console.log(
      `[BOT] Registered ${(registeredCommands as any).length}/${
        commandList.length
      } commands`,
    );
  } catch (err) {
    console.error(err);
  }
}
