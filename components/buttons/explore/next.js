import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { sessions } from "../../../schemas/session.js";
import { DiscordRequest } from "../../../utils.js";

export async function next(req, user, formatted, options) {
  const { userData, sessionData, locationData } = options;
  let data = sessionData.data;
  data.case += 1;
  await sessions.findOneAndUpdate(
    {
      sessionId: userData.session,
    },
    {
      $set: {
        data: data,
      },
    }
  );
  let arr = [];
  let aaa = "";
  data.rewards.forEach((r) => (aaa += `${r}\n`));
  const currentCase = sessionData.data.cases[data.case];
  if (!currentCase)
    return await DiscordRequest(
      `webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
      {
        method: "PATCH",
        body: {
          embeds: [
            {
              title: "You have finished the exploration!",
              description: `Rewards: ${aaa}`,
            },
          ],
          components: [],
        },
      }
    );
  currentCase.options.forEach((option) =>
    arr.push({
      label: option.name,
      value: `explore_${option.id}_${formatted[2]}`,
      description: option.description,
    })
  );
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: currentCase.name,
            description: currentCase.description,
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
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "option_pick",
                placeholder: "Select an option",
                min_value: 1,
                max_value: 1,
                options: arr,
              },
            ],
          },
        ],
      },
    }
  );
}
