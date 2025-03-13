import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function choose(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const mobList = [{ id: "goblin", name: "Goblin", description: "Goblin aa" }];
  const found = mobList.find((mob) => mob.id === formatted.value[1]);
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: found.name,
            description: found.description,
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
                    value: `hunt_goblin_${formatted.value[2]}`,
                    label: "Goblin",
                    description: "Goblin",
                  },
                ],
              },
            ],
          },
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_start_${formatted.value[2]}`,
                label: "Start",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
