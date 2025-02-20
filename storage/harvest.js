import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
const locations = "a";
("../locations.js");
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function harvest(req, options) {
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.sessionId != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return options.sessionId, session.sessionId;

  const { fish } = locations[0].data.drops;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        page: "start",
        sessionData: {
          Tool: null,
          Location: null,
        },
      },
    }
  );
  let ops = [];
  fish.forEach((spot) =>
    ops.push({
      label: spot.SPOT_NAME,
      value: `gather_harvest${spot.SPOT_ID}-l_${options.sessionId}`,
      description: spot.SPOT_DESCRIPTION,
    })
  );

  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Fishing",
            description: "Select a place and a tool below to fish at",
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
                options: [
                  {
                    label: "Fishing",
                    value: `gather_harvestd_${options.sessionId}`,
                    description: "Catch different fishes in the nearest lake",
                  },
                  {
                    label: "Mining",
                    value: `gather_mine-d_${options.sessionId}`,
                    description: "Mine wonderful ores and discover valuables",
                  },
                  {
                    label: "Harvesting",
                    value: `gather_harvest-d_${options.sessionId}`,
                    description:
                      "Harvest different crops from the fields and taste your harvest",
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
                    value: `gather_harvestdynamite-t_${options.sessionId}`,
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
                custom_id: `gather_harvestc_${options.sessionId}`,
                label: "Catch",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
