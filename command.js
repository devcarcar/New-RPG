import { explore } from "./storage/explore.js";
import { gather } from "./commands/gather.js";
import { hunt } from "./commands/hunt.js";
import { inventory } from "./storage/inventory.js";
import { DiscordRequest } from "./utils.js";
import "dotenv/config";

export async function commandHandler(req, user, userData, sessionId) {
  switch (req.body.data.name) {
    case "gather":
      await gather(req, user, { sessionId: sessionId, userData: userData });
      break;
    case "hunt":
      await hunt(req, user, { sessionId: sessionId, userData: userData });
      break;
    default:
      throw new Error("Unknown command " + req.body.data.name);
  }
}
