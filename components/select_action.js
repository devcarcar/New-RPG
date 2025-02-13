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
                custom_id: "select_action",
                placeholder: "Select an action",
                min_value: 1,
                max_value: 1,
                options: [
                  {
                    label: "Attack",
                    value: `hunt_attack_${options.formatted[2]}`,
                    description:
                      "Attack with your main attack(1 tile of range)",
                  },
                  {
                    label: "Critical Hit",
                    value: `crit_${options.formatted[2]}`,
                    description: "Crit with your main attack(1 tile of range)",
                  },
                ],
              },
            ],
          },
        ],
      },
    });
}
