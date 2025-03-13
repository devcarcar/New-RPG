import "dotenv/config";
import { DiscordRequest, Direction } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function select(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const last = session.data.log[session.data.log.length - 1].user1;
  const action =
    last.action != null
      ? "Your action is " + last.action
      : "You haven't selected your action yet";
  const movement =
    last.movement != null
      ? "Your movement is " + last.movement
      : "You haven't selected your movement yet";
  let opt = [];
  let x = session.data.user1.x;
  let y = session.data.user1.y;
  if (x > 1)
    opt.push({
      label: "Left",
      value: `hunt_${Direction.LEFT}_${formatted[2]}`,
      description: "Move left",
    });
  if (x < 5)
    opt.push({
      label: "Right",
      value: `hunt_${Direction.RIGHT}_${formatted[2]}`,
      description: "Move right",
    });
  if (y > 1)
    opt.push({
      label: "Down",
      value: `hunt_${Direction.DOWN}_${formatted[2]}`,
      description: "Move down",
    });
  if (y < 5)
    opt.push({
      label: "Up",
      value: `hunt_${Direction.UP}_${formatted[2]}`,
      description: "Move up",
    });
  await DiscordRequest(`/webhooks/${process.env.APP_ID}/${sessionData.token}`, {
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
              options: opt,
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
                last.action == null || last.movement == null ? true : false,
            },
          ],
        },
      ],
    },
  });
}
