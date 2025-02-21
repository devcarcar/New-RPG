import "dotenv/config";
import { DiscordRequest } from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function action_bar(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    formatted.value[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;

  const action = formatted.value[1];
  const last = session.data.log[session.data.log.length - 1];
  last.user1.action = action;
  const log = session.data.log;
  log[session.data.length - 1] = last;
  const data = session.data;
  data.log = log;
  await sessions.findOneAndUpdate(
    { sessionId: session.sessionId },
    {
      $set: {
        data: data,
      },
    }
  );
  const news = await sessions.findOne({ sessionId: session.sessionId });
  const shortcut = news.data.log[news.data.log.length - 1].user1;
  const movement =
    shortcut.movement != null
      ? "Your movement is " + shortcut.movement
      : "You haven't selected your movement yet";
  const condition =
    shortcut.movement != null && shortcut.action != null ? false : true;

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: `Select Action`,
            description: `${movement}\n Your action is ${action}`,
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
                    value: `hunt_up_${formatted.value[2]}`,
                    description: "Move up",
                  },
                  {
                    label: "Down",
                    value: `hunt_down_${formatted.value[2]}`,
                    description: "Move down",
                  },
                  {
                    label: "Left",
                    value: `hunt_left_${formatted.value[2]}`,
                    description: "Move left",
                  },
                  {
                    label: "Right",
                    value: `hunt_right_${formatted.value[2]}`,
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
                    value: `hunt_attack_${formatted.value[2]}`,
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
                custom_id: `hunt_confirm_${formatted.value[2]}`,
                label: "Confirm",
                style: ButtonStyleTypes.SECONDARY,
                disabled: condition,
              },
            ],
          },
        ],
      },
    }
  );
}
