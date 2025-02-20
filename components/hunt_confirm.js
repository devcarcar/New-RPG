import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
import { locations } from "../schemas/location.js";

export async function hunt_confirm(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  const turn = session.data.log.length - 1;
  switch (session.data.log[session.data.log.length - 1].user1.movement) {
    case "up":
      session.data.user1.y++;
      break;
    case "down":
      session.data.user1.y--;
      break;
    case "left":
      session.data.user1.x--;
      break;
    case "right":
      session.data.user1.x++;
      break;
  }
  switch (session.data.log[session.data.log.length - 1].user1.action) {
    case "attack":
      break;
  }
  session.data.log.push({
    turn: turn + 1,
    user1: {
      movement: null,
      action: null,
    },
  });
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        data: session.data,
      },
    }
  );
  const updated = await sessions.findOne({ sessionId: userData.session });
  let str = `You moved\n`;
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
  if (
    options.formatted[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return console.log(options.sessionId, session.sessionId);

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
            description: str,
          },
        ],
      },
    }
  );
}
