import "dotenv/config";
import {
  CaseType,
  DiscordRequest,
  ExploreOutcomeType,
} from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";
import { locations } from "../../../schemas/location.js";

export async function option(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  const data = sessionData.data;
  const explore = locationData.data.explore;
  let found;
  for (let i = 0; i < explore.length; i++) {
    for (let j = 0; j < explore[i].options.length; j++) {
      if (explore[i].options[j].id == formatted.value[1])
        found = explore[i].options[j];
    }
  }
  const result =
    found.outcome[Math.floor(Math.random() * found.outcome.length)];

  let text;
  let v = result.values[0];
  switch (result.type) {
    case ExploreOutcomeType.REWARD:
      text = `You have received ${v.amount} ${v.type}`;
      data.rewards.push(`${v.amount} ${v.type}`);
      break;
    default:
      break;
  }
  await sessions.findOneAndUpdate(
    {
      sessionId: sessionData.sessionId,
    },
    {
      $set: {
        data: data,
      },
    }
  );
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: `Exploration`,
            description: text,
            footer: {
              text: `Step: ${data.case + 1}/3`,
            },
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                style: ButtonStyleTypes.SECONDARY,
                label: "Next",
                custom_id: `explore_next_${formatted.value[2]}`,
              },
            ],
          },
        ],
      },
    }
  );
}
