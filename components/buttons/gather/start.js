import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { users } from "../../../schemas/user.js";

export async function start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const result = locationData.data.gather.find((i) => i.name === formatted[1]);
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
