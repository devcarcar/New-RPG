import "dotenv/config";
import { CaseType, DiscordRequest, sort } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { sessions } from "../schemas/session.js";
import { users } from "../schemas/user.js";

export async function explore(req, user, options) {
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    formatted[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  await sessions.findOneAndUpdate(
    {
      sessionId: session.id,
    },
    {
      $set: {
        data: {
          cases: sort(
            [
              {
                type: CaseType.OPTION,
                name: "Wild Mushrooms",
                options: [
                  {
                    name: "Fetch",
                    description: "Get",
                    outcome: [],
                  },
                ],
              },
            ],
            3
          ),
        },
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
                custom_id: `explore_start_${options.sessionId}`,
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
