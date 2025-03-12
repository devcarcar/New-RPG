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

export async function option(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  const currentLocation = await locations.findOne({ locationId: "village" });
  if (
    formatted.value[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  const data = session.data;
  const explore = currentLocation.data.explore;
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
      sessionId: session.sessionId,
    },
    {
      $set: {
        data: data,
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
