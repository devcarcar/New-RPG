import "dotenv/config";
import { Direction, DiscordRequest, parseMovement } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function choose(req, user, formatted, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });

  const category = formatted[1];
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
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
