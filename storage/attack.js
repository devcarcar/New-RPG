import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { DiscordRequest } from "../utils.js";
import { sessions } from "../schemas/session.js";

export async function attack(req, id, user) {
  /* DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}
  `,
    {
      method: "PATCH",
      body: {
        flags: 64,
        embeds: [
          {
            title: "Select Action",
            description: "You selected attack",
          },
        ],
      },
    }
  ); */
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`,
    {
      method: "DELETE",
    }
  );
  let sessio = await sessions.findOne({ sessionId: id });
  let sessionData = sessio.sessionData;
  sessionData.player2.health -= sessionData.player1.attack;
  sessionData.player1.health -= sessionData.player2.attack;
  sessionData.turns.push({ turn: 1, player1: "attack", player2: "attack" });
  await sessions.findOneAndUpdate(
    { sessionId: id },
    {
      $set: {
        sessionData: sessionData,
      },
    }
  );
  const session = await sessions.findOne({
    sessionId: id,
  });
  if (session.sessionData.player1.health <= 0) {
    return await DiscordRequest(
      `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
      {
        method: "PATCH",
        body: {
          embeds: [
            {
              title: "Hunting",
              description: "You are busted",
            },
          ],
          components: [],
        },
      }
    );
  }
  if (session.sessionData.player2.health <= 0) {
    return await DiscordRequest(
      `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
      {
        method: "PATCH",
        body: {
          embeds: [
            {
              title: "Hunting",
              description: "You beat the boss!",
            },
          ],
          components: [],
        },
      }
    );
  }
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Hunting",
            description: `You dealt ${sessionData.player1.attack} damage\nLava Slime dealt ${sessionData.player2.attack} damage\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::dragon:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:man::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:`,
            fields: [
              {
                name: `${user.username}`,
                value: `Your Health: ${session.sessionData.player1.health}\nYour Attack: 10\nYour Defense: 5`,
                inline: true,
              },
              {
                name: `Lava Slime`,
                value: `Your Health: ${session.sessionData.player2.health}\nYour Attack: 10\nYour Defense: 5`,
                inline: true,
              },
            ],
          },
        ],
      },
    }
  );
}
