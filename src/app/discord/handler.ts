import {
  ActivityType,
  Client,
  GatewayIntentBits,
  Partials,
  REST,
} from "discord.js";
import config from "../../config";
import { setActivity } from "./activity";
import { loadFeatures } from "./loader";
import { registerFeatures } from "./register";
import interactionCreate from "../../features/events/interactionCreate";

const DEFAULT_INTENTS = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.User],
};

export const client = new Client(DEFAULT_INTENTS);
export const clientREST = new REST({
  version: "10",
}).setToken(config.DISCORD_TOKEN);

export async function startDiscordBot() {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("interactionCreate", interactionCreate);

  await loadFeatures();

  client.login();

  await registerFeatures();
  setActivity(client);
}
