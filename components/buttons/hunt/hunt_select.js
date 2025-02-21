import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function select_action(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    formatted[2] != userData.session ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  const last = session.data.log[session.data.log.length - 1].user1;
  const action =
    last.action != null
      ? "Your action is " + last.action
      : "You haven't selected your action yet";
  const movement =
    last.movement != null
      ? "Your movement is " + last.movement
      : "You haven't selected your movement yet";

  await DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}`, {
    method: "POST",
    body: {
      flags: 64,
      embeds: [
        {
          title: "Select Action",
          description:
            last.action == null && last.movement == null
              ? "Select an action to perform"
              : `${movement}\n${action}`,
        },
      ],
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: "movement_bar",
              placeholder: "Select a movement",
              min_value: 1,
              max_value: 1,
              options: [
                {
                  label: "Up",
                  value: `hunt_up_${formatted[2]}`,
                  description: "Move up",
                },
                {
                  label: "Down",
                  value: `hunt_down_${formatted[2]}`,
                  description: "Move down",
                },
                {
                  label: "Left",
                  value: `hunt_left_${formatted[2]}`,
                  description: "Move left",
                },
                {
                  label: "Right",
                  value: `hunt_right_${formatted[2]}`,
                  description: "Move right",
                },
              ],
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: "action_bar",
              placeholder: "Select an action",
              min_value: 1,
              max_value: 1,
              options: [
                {
                  label: "Attack",
                  value: `hunt_attack_${formatted[2]}`,
                  description: "Attack!",
                },
              ],
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `hunt_confirm_${formatted[2]}`,
              label: "Confirm",
              style: ButtonStyleTypes.SECONDARY,
              disabled:
                last.action == null && last.movement == null ? true : false,
            },
          ],
        },
      ],
    },
  });
}
