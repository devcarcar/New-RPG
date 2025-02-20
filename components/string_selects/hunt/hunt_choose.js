import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function choose_mob(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    formatted.value[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: formatted.value[1],
            description: formatted.value[1],
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_start_${formatted.value[2]}`,
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
