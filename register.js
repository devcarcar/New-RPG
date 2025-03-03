import "dotenv/config";
import { DiscordRequest } from "./utils.js";

try {
  await DiscordRequest(`applications/${process.env.APP_ID}/commands`, {
    method: "PUT",
    body: [
      {
        name: "explore",
        description: "Explore",
        type: 1,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
      },
      {
        name: "gather",
        description: "Gather",
        type: 1,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
      },
      {
        name: "hunt",
        description: "Try your luck at fishing and see if you have any catch!",
        type: 1,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
      },
    ],
  });
} catch (err) {
  console.error(err);
}
