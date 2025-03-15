import "dotenv/config";
import { DiscordRequest, sort } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { sessions } from "../schemas/session.js";
import { users } from "../schemas/user.js";
import { locations } from "../schemas/location.js";

export async function explore(req, user, sessionId, options) {
  const { userData, created, locationData } = options;
  const cases = sort(locationData.data.explore, 1);
  created.data.cases = cases;
  await sessions.findOneAndUpdate(
    {
      sessionId: created.sessionId,
    },
    {
      $set: {
        data: created.data,
      },
    }
  );
  const newest = await sessions.findOne({ sessionId: created.sessionId });
  newest.data.cases;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Exploring",
            description: "Start exploring nearby locations",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `explore_start_${sessionId}`,
                label: "Start",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
