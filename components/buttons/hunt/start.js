import "dotenv/config";
import { DiscordRequest, getGrid } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { move } from "../../../utils.js";

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  await sessions.findOneAndUpdate(
    {
      sessionId: formatted[2],
    },
    {
      $set: {
        data: {
          log: [
            {
              turn: 1,
              user1: {
                movement: null,
                action: null,
              },
              user2: {
                movement: move(1, 1, 5, 5),
                action: "attack",
              },
            },
          ],
          user1: {
            type: "player",
            id: user.id,
            x: 1,
            y: 1,
            health: 25,
            attack: 10,
            defense: 5,
          },
          user2: {
            type: "mob",
            id: formatted[1],
            x: 5,
            y: 5,
            health: 25,
            attack: 10,
            defense: 5,
          },
        },
      },
    }
  );
  const updated = await sessions.findOne({ sessionId: formatted[2] });
  const data = updated.data;
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
