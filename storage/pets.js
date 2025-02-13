import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";

export async function pets(req, options) {
  DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Pets",
            description: "p.",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "gather_bar",
                min_values: 1,
                max_values: 1,
                placeholder: "Select a resource gathering method",
                options: [
                  {
                    label: "Fishing",
                    value: `gather_fish-d_${options.sessionId}`,
                    description: "Catch different fishes in the nearest lake",
                  },
                  {
                    label: "Mining",
                    value: `gather_mine-d_${options.sessionId}`,
                    description: "Mine wonderful ores and discover valuables",
                  },
                  {
                    label: "Harvesting",
                    value: `gather_harvest-d_${options.sessionId}`,
                    description:
                      "Harvest different crops from the fields and taste your harvest",
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
