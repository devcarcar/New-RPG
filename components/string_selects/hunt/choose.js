import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function choose(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const mobList = [{ id: "goblin", name: "Goblin", description: "Goblin aa" }];
  const found = mobList.find((mob) => mob.id === formatted.value[1]);
  await sessions.findOneAndUpdate(
    {
      sessionId: formatted.value[2],
    },
    {
      $set: {
        data: {
          log: [
            {
              turn: 1,
              user: 1,
              data: {
                movement: undefined,
                action: undefined,
              },
            },
          ],
          user1: {
            type: "player",
            id: user.id,
            name: user.username,
            x: 1,
            y: 1,
            health: 25,
            attack: 10,
            defense: 5,
          },
          user2: {
            type: "mob",
            id: found.id,
            name: found.name,
            x: 5,
            y: 5,
            health: 25,
            attack: 15,
            defense: 5,
          },
        },
      },
    }
  );
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
