import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
import { locations } from "../schemas/location.js";

export async function gather_start(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });

  if (
    options.formatted[2] !== session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  ) {
    return console.log(options.sessionId, session.sessionId);
  }
  const l = options.formatted[1].split("-")[0];
  const ld = await locations.findOne({ locationId: "village" });
  const result = ld.data.gather.find((i) => i.name === l);
  const Inventory = userData.inventory;

  await users.findOneAndUpdate(
    {
      userId: options.user.id,
    },
    {
      $set: {
        Inventory: Inventory,
      },
    }
  );

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Gathering",
            description: `You are gathering ${result.drop} and you need to wait for ${result.time} minutes`,
          },
        ],
        components: [],
      },
    }
  );
}
