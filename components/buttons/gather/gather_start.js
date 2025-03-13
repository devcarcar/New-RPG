import "dotenv/config";
import { DiscordRequest } from "../../../utils";
import { users } from "../../../schemas/user";
import { sessions } from "../../../schemas/session";

export async function gather_start(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
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
