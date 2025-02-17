import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
const locations = "a";
("../locations.js");
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function hunt_start(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.formatted[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
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
  let str = "";
  for (let y = 5; y >= 1; y--) {
    for (let x = 1; x <= 5; x++) {
      if (x == updated.data.user1.x && y == updated.data.user1.y) {
        str += ":man:";
      } else if (x == updated.data.user2.x && y == updated.data.user2.y) {
        str += ":skull:";
      } else {
        str += ":black_large_square:";
      }
    }
    str += "\n";
  }
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "You are in a battle",
            description: str,
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
