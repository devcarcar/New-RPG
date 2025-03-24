import "dotenv/config";
import { Movement, DiscordRequest, parseMovement } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function choose(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const category = formatted[1];
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: category,
            description: "Items:\nApple",
          },
        ],
        components: [],
      },
    }
  );
}
