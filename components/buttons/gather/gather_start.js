import "dotenv/config";
import { DiscordRequest } from "../../../utils";
import { users } from "../../../schemas/user";
import { sessions } from "../../../schemas/session";

export async function gather_start(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
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
