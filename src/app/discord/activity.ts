import { ActivityType, Client } from "discord.js";

export function setActivity(client: Client) {
  client.user?.setActivity({
    name: "Discord Mafia",
    url: "https://discord.gg/social-deduction",
    type: ActivityType.Playing,
  });
}
