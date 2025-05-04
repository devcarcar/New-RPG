import "dotenv/config";
import { DiscordRequest } from "./utils.js";

try {
  await DiscordRequest(`applications/${process.env.APP_ID}/commands`, {
    method: "PUT",
    body: [
      {
        name: "game",
        description: "Game",
        type: 1,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
      },
    ],
  });
} catch (err) {
  console.error(err);
}
