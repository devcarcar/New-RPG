import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { sessions } from "../schemas/session.js";
import { users } from "../schemas/user.js";

export async function inventory(req, options) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Inventory",
            description: "Inventory system",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: `inventory_default_${options.sessionId}`,
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    value: `inventory_fish_${options.sessionId}`,
                    label: "Fish",
                    description: "Fishing related fishes",
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
