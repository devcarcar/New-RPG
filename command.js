import { gather } from "./commands/gather.js";
import { hunt } from "./commands/hunt.js";
import { inventory } from "./storage/inventory.js";
import { DiscordRequest } from "./utils.js";
import { guild } from "./commands/guild.js";
import { explore } from "./commands/explore.js";
import { item } from "./commands/item.js";

export async function commandHandler(req, user, userData, sessionId) {
  switch (req.body.data.name) {
    case "gather":
      await gather(req, user, { sessionId: sessionId, userData: userData });
      break;
    case "hunt":
      await hunt(req, user, { sessionId: sessionId, userData: userData });
      break;
    case "explore":
      await explore(req, user, { sessionId: sessionId });
      break;
    case "guild":
      await guild(req, user, { sessionId: sessionId });
      break;
    case "item":
      await item(req, user, { sessionId: sessionId });
      break;
    default:
      throw new Error("Unknown command " + req.body.data.name);
  }
}
