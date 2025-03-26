import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { users } from "../../../schemas/user.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { time } from "discord.js";
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

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const found = arr.find((i) => i.id === formatted[1]);
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Gathering",
            description: `You started gathering @${found.name} for ${
              found.drop.name
            }\nYou will be ready in <t:${
              Math.floor(Date.now() / 1000) + found.time
            }:R>`,
          },
        ],
        components: [],
      },
    }
  );
}
