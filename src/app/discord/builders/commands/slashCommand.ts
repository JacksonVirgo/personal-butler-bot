import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { InteractionContext } from "../../context";
import {
  ErrorCode,
  handleInteractionError,
  InteractionError,
} from "../../errors";

export type SlashCommandExecution = (
  i: ChatInputCommandInteraction,
  ctx: InteractionContext,
) => unknown | Promise<unknown>;
export const defaultSlashCommandExecute: SlashCommandExecution = async (
  i,
  _ctx,
) => {
  await i.reply({
    content: "This slash command has not been implemented yet.",
    ephemeral: true,
  });
};

export type SlashCommandAutocomplete = (
  i: AutocompleteInteraction,
) => unknown | Promise<unknown>;

export class SlashCommand extends SlashCommandBuilder {
  public static registry = new Map<string, SlashCommand>();
  private executeFunc: SlashCommandExecution = defaultSlashCommandExecute;
  private autocompleteFunction?: SlashCommandAutocomplete;
  static slashCommands: any;

  constructor(name: string) {
    super();
    this.setName(name);

    if (SlashCommand.registry.has(name))
      throw new Error(`Slash Command ${name} already exists.`);
    SlashCommand.registry.set(name, this);
  }

  public addOptions(func: (b: SlashCommandBuilder) => any) {
    func(this);
    return this;
  }

  public onExecute(executeFunc: SlashCommandExecution) {
    this.executeFunc = executeFunc;
    return this;
  }

  public onAutocomplete(autocompleteFunction: SlashCommandAutocomplete) {
    this.autocompleteFunction = autocompleteFunction;
    return this;
  }

  public async run(
    inter: ChatInputCommandInteraction,
    ctx: InteractionContext,
  ) {
    try {
      const serverId = inter.guildId;
      if (!serverId)
        throw new InteractionError(
          "You must be in a server to use this command.",
        );

      await this.executeFunc(inter, ctx);
    } catch (err) {
      await handleInteractionError(err, inter);
    }
  }
}
