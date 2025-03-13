import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";
import { DiscordRequest } from "../../../utils.js";

export async function start(req, user, formatted, options) {
  let data = session.data;
  data.case = 0;
  data.rewards = [];
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
  const currentCase = session.data.cases[0];
  currentCase.options.forEach((option) => {
    arr.push({
      label: option.name,
      value: `explore_${option.id}_${options.formatted[2]}`,
      description: option.description,
    });
  });
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
              text: "Step: 1/3",
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
