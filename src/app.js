import "dotenv/config";
import {
  ButtonStyleTypes,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";
import { ButtonStyle } from "discord.js";

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
      if (
        req.body.data.component_type === MessageComponentTypes.STRING_SELECT
      ) {
        if (req.body.data.values[0] === "inventory") {
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
                    title: "Inventory Page",
                    description: "Select a CATEGORY below",
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
                        custom_id: "inventory_bar",
                        placeholder: "Choose a category",
                        options: [
                          {
                            value: "fish",
                            label: "Fish",
                            description: "Check your fishing(CAT) items",
                          },
                        ],
                      },
                    ],
                  },
                ],
              }),
            }
          );
        } else if (req.body.data.values[0] === "fish") {
          fetch(
            `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                flags: 64,
                embeds: [
                  {
                    title: "Fishing Page",
                    description: "Select an ITEM below",
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
                        custom_id: "item_bar",
                        placeholder: "Choose an item",
                        options: [
                          {
                            value: "cod",
                            label: "Cod",
                            description: "A common fish.",
                          },
                        ],
                      },
                    ],
                  },
                ],
              }),
            }
          );
        } else {
          fetch(
            `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                flags: 64,
                embeds: [
                  {
                    title: "Cod",
                    description: "You have 5 cod.",
                  },
                ],
                components: [
                  {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                      {
                        type: MessageComponentTypes.BUTTON,
                        custom_id: "use",
                        label: "Use",
                        style: ButtonStyleTypes.SECONDARY,
                      },
                    ],
                  },
                ],
              }),
            }
          );
        }
      } else {
        if (req.body.data.custom_id === "use") {
          fetch(
            `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                flags: 64,
                embeds: [
                  {
                    title: "Cod Used",
                    description: "You used 1 cod!",
                  },
                ],
              }),
            }
          );
        }
      }
    }
  }
);

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
