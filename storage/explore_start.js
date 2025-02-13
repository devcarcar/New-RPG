import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
import { locations } from "../schemas/location.js";

export async function explore_start(req, options) {
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.sessionId != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  )
    return;
  const location = await locations.findOne({ locationId: "village" });
  const explore = location.locationData.explore;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        page: "start",
      },
    }
  );

  const random = Math.floor(Math.random() * explore.length);
  let arr = [];
  explore[random].OPTIONS.forEach((option) => {
    arr.push({
      label: option.OPTION_NAME,
      value: `explore_${option.OPTION_ID}_${options.sessionId}`,
      description: option.OPTION_DESCRIPTION,
    });
  });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: explore[random].CASE_NAME,
            description: "desc",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "explore",
                placeholder: "Select a place",
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
