import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import {
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
const itemList = [
  {
    id: "apple",
    name: "Apple",
    description: "Apple",
  },
];

export async function item(req, user, options) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Items",
            description: "Find items",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                min_value: 1,
                max_value: 1,
                custom_id: "item_choose",
                options: [
                  {
                    value: `item_fish_${options.sessionId}`,
                    label: "Fish",
                    description: "Check fishes",
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
