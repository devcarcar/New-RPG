import "dotenv/config";
import {
  DiscordRequest,
  move,
  movementHandler,
  Direction,
  actionHandler,
  getGrid,
} from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function confirm(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const turn = sessionData.data.log.length;
  let { user1, user2 } = movementHandler(
    sessionData.data.log[sessionData.data.log.length - 1].user1.movement,
    sessionData.data.log[sessionData.data.log.length - 1].user2.movement,
    sessionData.data.user1,
    sessionData.data.user2
  );
  user1 = actionHandler(
    sessionData.data.log[sessionData.data.log.length - 1].user1.action,
    sessionData.data.log[sessionData.data.log.length - 1].user2.action,
    sessionData.data.user1,
    sessionData.data.user2
  );
  user2 = actionHandler(
    sessionData.data.log[sessionData.data.log.length - 1].user1.action,
    sessionData.data.log[sessionData.data.log.length - 1].user2.action,
    sessionData.data.user1,
    sessionData.data.user2
  );
  sessionData.data.log.push({
    turn: turn + 1,
    user1: {
      movement: null,
      action: null,
    },
    user2: {
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
        data: session.data,
      },
    }
  );
  const updated = await sessions.findOne({ sessionId: userData.sessionData });
  const data = updated.data;

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "DELETE",
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
              "You moved\n" +
              getGrid(data.user1.x, data.user1.y, data.user2.x, data.user2.y),
          },
        ],
      },
    }
  );
}
