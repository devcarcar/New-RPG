import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function select_action(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.formatted[2] != userData.session ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  return DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}`, {
    method: "POST",
    body: {
      flags: 64,
      embeds: [
        {
          title: "Select Action",
          description: "Select an action to perform",
        },
      ],
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: "movement_bar",
              placeholder: "Select a movement",
              min_value: 1,
              max_value: 1,
              options: [
                {
                  label: "Up",
                  value: `hunt_up_${options.formatted[2]}`,
                  description: "Move up",
                },
              ],
            },
          ],
        },
      ],
    },
  });
}
