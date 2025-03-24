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

export async function confirm(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const last = sessionData.data.log[sessionData.data.log.length - 1];
  const turn = sessionData.data.log.length;
  let { user2 } = sessionData.data;
  let user1 = movementHandler(
    last.data.movement,
    sessionData.data.user1,
    sessionData.data.user2
  );
  let action = actionHandler(
    last.data.action,
    sessionData.data.user1,
    sessionData.data.user2
  );
  user1 = action.user1;

  sessionData.data.log.push({
    turn: turn + 1,
    user: 2,
    data: {
      movement: move(user1.x, user1.y, user2.x, user2.y),
      action: "attack",
    },
  });
  sessionData.data.user1 = user1;
  sessionData.data.user2 = user2;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        data: sessionData.data,
      },
    }
  );
  const updated = await sessions.findOne({ sessionId: userData.session });
  const data = updated.data;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "DELETE",
    }
  );
  if (updated.data.user2.health <= 0)
    return DiscordRequest(
      `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
      {
        method: "PATCH",
        body: {
          embeds: [
            {
              title: "Victory!",
              description: "You are rewarded with:",
            },
          ],
          components: [],
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
            title: "You are in a battle!",
            description:
              `You moved\n${action.text}` +
              getGrid(data.user1.x, data.user1.y, data.user2.x, data.user2.y),
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
                custom_id: `hunt_next_${formatted[2]}`,
                label: "Next",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
