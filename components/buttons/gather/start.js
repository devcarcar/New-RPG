import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { users } from "../../../schemas/user.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { time } from "discord.js";

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
}
