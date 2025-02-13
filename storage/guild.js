import "dotenv/config";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DiscordRequest } from "../utils.js";
import { users } from "../schemas/user.js";
import { guilds } from "../schemas/guild.js";
export async function guild_hall(req, id, user) {
  let f = [];
  const userData = await users.findOne({ userId: user.id });
  const guild = await guilds.findOne({ guildId: userData.Guild });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: guild.guildName,
            description: "desc",
          },
        ],
      },
    }
  );
}
export async function guild_members(req, id, user) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Guild Members",
            description:
              "Guild Hall provides the information for your guild and displays your guild achievements",
            fields: [
              {
                name: "Easter Trophy 2025",
                value: "#1",
                inline: true,
              },
            ],
          },
        ],
      },
    }
  );
}
export async function guild_manage(req, id, user) {
  let f = [];
  let e = [];
  const userData = await users.findOne({ userId: user.id });
  const guild = await guilds.findOne({ guildId: userData.Guild });
  guild.Members.forEach((member) => {
    e.push({
      type: MessageComponentTypes.BUTTON,
      custom_id: member.userId,
      label: member.userId,
      style: ButtonStyleTypes.SECONDARY,
    });
    f.push({ name: member.userId, value: member.role, inline: true });
  });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Guild Manage",
            description: "Your guild's members:",
            fields: f,
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: e,
          },
        ],
      },
    }
  );
}
export async function guild_raid(req, id, user) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Guild Raid",
            description: "Guild raid currently not on",
          },
        ],
      },
    }
  );
}
