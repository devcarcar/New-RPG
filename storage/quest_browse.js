import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
const locations = "a";
("../locations.js");
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";

export async function quest_browse(req, options) {
  const userData = await users.findOne({ userId: options.user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  if (
    options.sessionId != session.sessionId ||
    new Date(session.expireAt).getTime() < Date.now()
  ) {
    console.log(
      options.sessionId != session.sessionId ||
        new Date(session.expireAt).getTime() < Date.now()
    );
  }
  const quests = locations[0].data.quests;
  await sessions.findOneAndUpdate(
    { sessionId: userData.session },
    {
      $set: {
        page: "browse",
      },
    }
  );

  let a = [];
  let page = 0;

  quests[page].QUEST_REWARD.forEach((option) =>
    a.push(`${option.type}: ${option.value}\n`)
  );
  let opt = [];
  quests.forEach((quest) => {
    opt.push({
      label: quest.QUEST_NAME,
      value: `quest_${quest.QUEST_ID}-b_${options.sessionId}`,
      description: quest.QUEST_REQUIREMENT,
    });
  });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: quests[page].QUEST_NAME,
            description: `${quests[page].QUEST_DESCRIPTION}\n\nRewards: ${a}`,
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "quest_b",
                placeholder: "Select a quest",
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
                type: MessageComponentTypes.BUTTON,
                custom_id: `quest_${quests[page].QUEST_ID}-a_${options.sessionId}`,
                label: "Accept Quest",
                style: ButtonStyleTypes.SUCCESS,
              },
            ],
          },
        ],
      },
    }
  );
}
