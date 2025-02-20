import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
import { locations } from "../schemas/location.js";

export async function gather(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.sessionId != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;

  const l = await locations.findOne({ locationId: "village" });
  /*  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        sessionData: {
          Location: options,
        },
      },
    }
  );*/
  const data = l.data.gather;
  let ops = [];
  data.forEach((spot) =>
    ops.push({
      label: spot.name,
      value: `gather_${spot.name}-d_${options.sessionId}`,
      description: `${spot.time}`,
    })
  );
  const selected = data.find((i) => i.name === options.match);
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: selected.name,
            description: `Time: ${selected.time}, Possible drop: ${selected.drop}`,
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "gather_bar",
                min_values: 1,
                max_values: 1,
                placeholder: "Select a resource gathering method",
                options: ops,
              },
            ],
          },
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `gather_${selected.name}-s_${options.sessionId}`,
                label: "Start",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
          /*
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "fish",
                placeholder: "Select a fishing location",
                min_value: 1,
                max_value: 1,
                options: ops,
              },
            ],
          },
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "f",
                placeholder: "Select a fishing tool",
                min_value: 1,
                max_value: 1,
                options: [
                  {
                    label: `Dynamite`,
                    value: `gather_fish-dynamite-t_${options.sessionId}`,
                    description: `Boom Boom Boom`,
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
                custom_id: `gather_fish-c_${options.sessionId}`,
                label: "Catch",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
          */
        ],
      },
    }
  );
}
