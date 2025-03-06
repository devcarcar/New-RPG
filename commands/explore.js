import "dotenv/config";
import { CaseType, DiscordRequest, sort } from "../utils.js";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { sessions } from "../schemas/session.js";
import { users } from "../schemas/user.js";

export async function explore(req, user, options) {
  const userData = await users.findOne({ userId: user.id });
  const session = await sessions.findOne({ sessionId: userData.session });
  const cases = sort(
    [
      {
        type: CaseType.OPTION,
        name: "Mystery Box",
        options: [
          {
            name: "Open it",
            description: "Discover what's inside",
            outcome: [],
          },
        ],
      },
      {
        type: CaseType.OPTION,
        name: "Cave Exploration",
        options: [
          {
            name: "Enter the cave",
            description: "Explore the dark depths",
            outcome: [],
          },
        ],
      },
      {
        type: CaseType.OPTION,
        name: "Hidden Path",
        options: [
          {
            name: "Take the hidden path",
            description: "Follow the winding trail",
            outcome: [
              "You discover a beautiful waterfall.",
              "You meet a wise old hermit.",
              "You trip and fall into a bush.",
            ],
          },
        ],
      },
      {
        type: CaseType.OPTION,
        name: "Ancient Ruins",
        options: [
          {
            name: "Investigate the ruins",
            description: "Search for artifacts",
            outcome: [
              "You find a rare artifact!",
              "It's just rubble.",
              "You trigger a hidden trap!",
            ],
          },
        ],
      },
      {
        type: CaseType.OPTION,
        name: "Enchanted Forest",
        options: [
          {
            name: "Walk through the forest",
            description: "Feel the magic around you",
            outcome: [
              "You encounter a talking animal.",
              "You get lost and meet a fairy.",
              "The forest is eerily silent.",
            ],
          },
        ],
      },
    ],
    3
  );

  await sessions.findOneAndUpdate(
    {
      sessionId: session.sessionId,
    },
    {
      $set: {
        data: {
          cases: cases,
        },
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
            title: "Exploring",
            description: "Start exploring nearby locations",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `explore_start_${options.sessionId}`,
                label: "Start",
                style: ButtonStyleTypes.SECONDARY,
              },
            ],
          },
        ],
      },
    }
  );
}
