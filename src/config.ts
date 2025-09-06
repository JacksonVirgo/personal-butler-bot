import { z } from "zod";
import "dotenv/config";

export const envConfig = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
});

export default (() => {
  return envConfig.parse(process.env);
})();
