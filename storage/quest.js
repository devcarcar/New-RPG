import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { sessions } from "../schemas/session.js";
import { users } from "../schemas/user.js";

export async function quest(req, options) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Quest",
            description: "Quest system",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: `inventory_fish_${options.sessionId}`,
                min_value: 1,
                max_value: 1,
                options: [
                  {
                    value: `quest_bq_${options.sessionId}`,
                    label: "Browse Quests",
                    description: "Browse different quests",
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
