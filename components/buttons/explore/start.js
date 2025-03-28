import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";
import { DiscordRequest } from "../../../utils.js";

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
}
