import "dotenv/config";
import {
  CaseType,
  DiscordRequest,
  ExploreOutcomeType,
  ExploreTest,
} from "../../../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { users } from "../../../schemas/user.js";
import { sessions } from "../../../schemas/session.js";

const arr = ExploreTest;

export async function explore_option(req, options) {
  const { user, formatted } = options;
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    formatted.value[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  const data = session.data;
  let found;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].options.length; j++) {
      if (arr[i].options[j].id == formatted.value[1]) found = arr[i].options[j];
    }
  }
  const result =
    found.outcome[Math.floor(Math.random() * found.outcome.length)];

  let text;
  let v = result.values[0];
  switch (result.type) {
    case ExploreOutcomeType.REWARD:
      text = `You have received ${v.amount} ${v.type}`;
      break;
    default:
      break;
  }
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
