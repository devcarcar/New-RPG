import "dotenv/config";
import {
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    const { type, data } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });

      await fetch(
        `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "Game Page",
                description: "Select a FEATURE below",
              },
            ],
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT,
                    min_value: 1,
                    max_value: 1,
                    custom_id: "game_bar",
                    placeholder: "Choose a feature",
                    options: [
                      {
                        value: "inventory",
                        label: "Inventory",
                        description: "Check your inventory",
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        }
      ).then((res) => console.log(res.status));
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      });
      fetch(
        `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "Game Page",
                description: "Select a FEATURE below",
              },
            ],
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT,
                    min_value: 1,
                    max_value: 1,
                    custom_id: "game_bar",
                    placeholder: "Choose a feature",
                    options: [
                      {
                        value: "inventory",
                        label: "Inventory",
                        description: "Check your inventory",
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        }
      );
    }
  }
);

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
