import "dotenv/config";
import {
  DiscordRequest,
  move,
  movementHandler,
  Movement,
  actionHandler,
  getGrid,
  EditMessage,
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
  let text = "";
  movementHandler(last.data.movement, sessionData.data.user1, text);
  actionHandler(
    last.data.action,
    sessionData.data.user1,
    sessionData.data.user2,
    text
  );

  sessionData.data.log.push({
    turn: turn + 1,
    user: 2,
    data: {
      movement: move(
        sessionData.data.user1.x,
        sessionData.data.user1.y,
        user2.x,
        user2.y
      ),
      action: "attack",
    },
  });

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
  const { data } = updated;
  await EditMessage(req.body.token, {
    method: "DELETE",
  });
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
              text +
              getGrid(data.user1.x, data.user1.y, data.user2.x, data.user2.y),
            fields: [
              {
                name: data.user1.name,
                value: `Health: ${data.user1.health}\nAttack: ${data.user1.attack}\nDefense: ${data.user1.defense}`,
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
