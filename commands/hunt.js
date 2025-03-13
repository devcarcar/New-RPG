import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function hunt(req, user, sessionId, options) {
  const { userData, sessionData, locationData } = options;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Hunting",
            description: "Select a mob to attack",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "choose_mob",
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    value: `hunt_goblin_${options.sessionId}`,
                    label: "Goblin",
                    description: "Goblin",
                  },
                ],
              },
            ],
          },
        ],
      },
    }
  );
}
