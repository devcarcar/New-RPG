import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { users } from "../../../schemas/user.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
const arr = [
  {
    id: "appletreegrove",
    name: "Apple Tree Grove",
    description: "Drops apple",
    drop: {
      id: "apple",
      name: "Apple",
    },
    time: 3 * 60,
  },
];

export async function choose(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const found = arr.find((i) => i.id === formatted.value[1]);

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Gathering",
            description: found.description,
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `gather_${found.id}_${formatted.value[2]}`,
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
