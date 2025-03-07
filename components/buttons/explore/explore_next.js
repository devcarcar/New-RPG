import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";
import { DiscordRequest } from "../../../utils.js";

export async function explore_next(req, options) {
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.formatted[2] != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return console.log(options.formatted[2], session.sessionId);
  let data = session.data;
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
  const currentCase = session.data.cases[data.case];
  currentCase.options.forEach((option) =>
    arr.push({
      label: option.name,
      value: `explore_${option.id}_${options.formatted[2]}`,
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
