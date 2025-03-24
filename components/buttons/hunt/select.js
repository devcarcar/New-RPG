import "dotenv/config";
import { DiscordRequest, Movement } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

export async function select(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const last = sessionData.data.log[sessionData.data.log.length - 1].data;
  const action =
    last.action != null
      ? "Your action is " + last.action
      : "You haven't selected your action yet";
  const movement =
    last.movement != null
      ? "Your movement is " + last.movement
      : "You haven't selected your movement yet";
  let opt = [
    {
      label: "No movement",
      value: `hunt_${Movement.NO_MOVEMENT}_${formatted[2]}`,
      description: "No movement",
    },
  ];
  let x = sessionData.data.user1.x;
  let y = sessionData.data.user1.y;
  if (x > 1)
    opt.push({
      label: "Left",
      value: `hunt_${Movement.LEFT}_${formatted[2]}`,
      description: "Move left",
    });
  if (x < 5)
    opt.push({
      label: "Right",
      value: `hunt_${Movement.RIGHT}_${formatted[2]}`,
      description: "Move right",
    });
  if (y > 1)
    opt.push({
      label: "Down",
      value: `hunt_${Movement.DOWN}_${formatted[2]}`,
      description: "Move down",
    });
  if (y < 5)
    opt.push({
      label: "Up",
      value: `hunt_${Movement.UP}_${formatted[2]}`,
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
                {
                  label: "No Action",
                  value: `hunt_no_${formatted[2]}`,
                  description: "No Action",
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
