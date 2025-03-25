import "dotenv/config";
import {
  DiscordRequest,
  move,
  movementHandler,
  Movement,
  actionHandler,
  getGrid,
} from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function next(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const last = sessionData.data.log[sessionData.data.log.length - 1];
  const turn = sessionData.data.log.length;
  let { user1 } = sessionData.data;
  let text = "";
  movementHandler(last.data.movement, sessionData.data.user2, text);
  actionHandler(
    last.data.action,
    sessionData.data.user2,
    sessionData.data.user1,
    text
  );

  sessionData.data.log.push({
    turn: turn + 1,
    user: 1,
    data: {
      movement: undefined,
      action: undefined,
    },
  });

  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        data: sessionData.data,
      },
    }
  );
  const updated = await sessions.findOne({ sessionId: userData.session });
  if (updated.data.user1.health <= 0)
    return DiscordRequest(
      `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
      {
        method: "PATCH",
        body: {
          embeds: [
            {
              title: "Defeat!",
              description: "You get nothing",
            },
          ],
          components: [],
        },
      }
    );
  const data = updated.data;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "You are in a battle!",
            description:
              text +
              getGrid(data.user1.x, data.user1.y, data.user2.x, data.user2.y),
            fields: [
              {
                name: user1.name,
                value: `Health: ${user1.health}\nAttack: ${user1.attack}\nDefense: ${user1.defense}`,
                inline: true,
              },
              {
                name: sessionData.data.user2.name,
                value: `Health: ${sessionData.data.user2.health}\nAttack: ${sessionData.data.user2.attack}\nDefense: ${sessionData.data.user2.defense}`,
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
                label: "Select",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
