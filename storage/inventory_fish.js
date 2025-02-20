import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";

import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function inventory_fish(req, options) {
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.sessionId != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now() ||
    session.page != "default"
  )
    return console.log(
      options.sessionId != session.sessionId,
      new Date(session.expireAt).getTime() < Date.now(),
      session.page != "default"
    );
  const { FISH } = locations[0].data.drops;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        page: "start",
      },
    }
  );
  items.forEach((item) => {
    item.amount = userData.Inventory.get(item.id) ?? 0;
  });
  const filtered = items.filter((item) => item.type === "FISH");
  let str = "";
  filtered.forEach((item) => {
    str += item.name + " " + item.amount + "\n";
  });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Inventory",
            fields: [
              {
                name: "Fish",
                value: str,
                inline: true,
              },
              {
                name: ".",
                value: "...",
                inline: true,
              },
            ],
          },
        ],
      },
    }
  );
}
