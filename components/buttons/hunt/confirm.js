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

export async function confirm(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });

  const turn = session.data.log.length;
  let { user1, user2 } = movementHandler(
    session.data.log[session.data.log.length - 1].user1.movement,
    session.data.log[session.data.log.length - 1].user2.movement,
    session.data.user1,
    session.data.user2
  );
  user1 = actionHandler(
    session.data.log[session.data.log.length - 1].user1.action,
    session.data.log[session.data.log.length - 1].user2.action,
    session.data.user1,
    session.data.user2
  );
  user2 = actionHandler(
    session.data.log[session.data.log.length - 1].user1.action,
    session.data.log[session.data.log.length - 1].user2.action,
    session.data.user1,
    session.data.user2
  );
  session.data.log.push({
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
  session.data.user1 = user1;
  session.data.user2 = user2;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        data: session.data,
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
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${session.token}/messages/@original`,
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
