import "dotenv/config";
import { Movement, DiscordRequest, getGrid } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { move } from "../../../utils.js";

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const updated = await sessions.findOne({ sessionId: formatted[2] });
  const data = updated.data;
  const { user1, user2 } = data;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "You are in a battle",
            description: getGrid(
              data.user1.x,
              data.user1.y,
              data.user2.x,
              data.user2.y
            ),
            fields: [
              {
                name: user1.name,
                value: `Health: ${user1.health}\nAttack: ${user1.attack}\nDefense: ${user1.defense}`,
                inline: true,
              },
              {
                name: user2.name,
                value: `Health: ${user2.health}\nAttack: ${user2.attack}\nDefense: ${user2.defense}`,
                inline: true,
              },
            ],
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_select_${formatted[2]}`,
                label: "Select Action",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
