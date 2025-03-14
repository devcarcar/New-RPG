import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { users } from "../schemas/user.js";

export async function guild(req, user, sessionId, options) {
  const { userData, sessionData, locationData } = options;
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Guild",
            description:
              "A guild is where multiple players team up to form as an alliance together to fight against bosses",
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "guild_select",
                placeholder: "Select an option",
                min_value: 1,
                max_value: 1,
                options: [
                  {
                    label: "Guild Hall",
                    value: `guild_hall_${sessionId}`,
                    description: "View guild info and legacies",
                  },
                  {
                    label: "Members",
                    value: `guild_members_${sessionId}`,
                    description: "Check your guild members",
                  },
                  {
                    label: "Manage Members",
                    value: `guild_manage_${sessionId}`,
                    description:
                      "Kick, demote, or promote members (Helpers and Leaders only)",
                  },
                  {
                    label: "Guild Raid",
                    value: `guild_raid_${sessionId}`,
                    description: "Check guild raid status and details",
                  },
                ],
              },
            ],
          },
        ],
      },
    }
  );
}
