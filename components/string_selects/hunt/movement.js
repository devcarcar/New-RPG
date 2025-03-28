import "dotenv/config";
import {
  Action,
  DiscordRequest,
  Movement,
  parseMovement,
} from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function movement(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const movement = parseInt(formatted.value[1]);
  const last = sessionData.data.log[sessionData.data.log.length - 1];
  last.data.movement = movement;
  const log = sessionData.data.log;
  log[sessionData.data.length - 1] = last;
  const data = sessionData.data;
  data.log = log;
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: data,
      },
    }
  );
  let opt = [
    {
      label: "No movement",
      value: `hunt_${Movement.NO_MOVEMENT}_${formatted.value[2]}`,
      description: "No movement",
    },
  ];
  let x = sessionData.data.user1.x;
  let y = sessionData.data.user1.y;
  if (x > 1)
    opt.push({
      label: "Left",
      value: `hunt_${Movement.LEFT}_${formatted.value[2]}`,
      description: "Move left",
    });
  if (x < 5)
    opt.push({
      label: "Right",
      value: `hunt_${Movement.RIGHT}_${formatted.value[2]}`,
      description: "Move right",
    });
  if (y > 1)
    opt.push({
      label: "Down",
      value: `hunt_${Movement.DOWN}_${formatted.value[2]}`,
      description: "Move down",
    });
  if (y < 5)
    opt.push({
      label: "Up",
      value: `hunt_${Movement.UP}_${formatted.value[2]}`,
      description: "Move up",
    });
  const news = await sessions.findOne({ sessionId: sessionData.sessionId });
  const shortcut = news.data.log[news.data.log.length - 1].data;
  const action =
    shortcut.action != null
      ? "Your action is " + shortcut.action
      : "You haven't selected your action yet";
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
            description: `Your movement is ${parseMovement(
              movement
            )}\n${action}`,
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
                    label: "No Action",
                    value: `hunt_${Action.NO_ACTION}_${formatted.value[2]}`,
                    description: "No action",
                  },
                  {
                    label: "Attack",
                    value: `hunt_${Action.ATTACK}_${formatted.value[2]}`,
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
