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
import { users } from "../schemas/user.js";
import { sessions } from "../schemas/session.js";
import { ComponentType } from "discord.js";
import { EditMessage } from "../utils.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    const { type } = req.body;

    if (type === InteractionType.APPLICATION_COMMAND) {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });
      const created = await sessions.create({});
      await users.findOneAndUpdate(
        { userId: req.body.member.user.id },
        { session: created.sessionId }
      );
      await EditMessage(
        req.body.token,
        [
          {
            title: "Game Page",
            description: "Select a FEATURE below",
          },
        ],
        [
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
                    value: "fish",
                    label: "Fish",
                    description: "Fishing",
                  },
                  {
                    value: "mine",
                    label: "Mine",
                    description: "Mining",
                  },
                  {
                    value: "inventory",
                    label: "Inventory",
                    description: "Inv",
                  },
                  {
                    value: "map",
                    label: "Map",
                    description: "Maping",
                  },
                  {
                    value: "tribe",
                    label: "Tribe",
                    description: "Tribing",
                  },
                  {
                    value: "hunt",
                    label: "Hunt",
                    description: "Hunting",
                  },
                ],
              },
            ],
          },
        ]
      );
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      });

      const user = req.body.member.user;
      const userData = await users.findOne({
        userId: user.id,
      });

      const sessionData = await sessions.findOne({
        sessionId: userData.session,
      });
      const data = {
        userData: userData,
        sessionData: sessionData,
        locationData: null,
      };
      const interaction = {
        token: req.body.token,
        user: user,
        custom_id: req.body.data.custom_id,
        value: req.body.data.values?.[0],
      };

      await ComponentHandler.execute(interaction, data);
    }
  }
);

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

class ComponentHandler {
  static async execute(interaction, data) {
    let file;
    const formatted = interaction.custom_id.split("/");
    if (formatted[0] === "game_bar") {
      file = await import(`../components/${interaction.value}.js`);
    } else if (interaction.custom_id.includes("@")) {
      file = await import(
        `../components/${interaction.custom_id.replace(
          "@",
          interaction.value
        )}.js`
      );
    } else {
      file = await import(`../components/${interaction.custom_id}.js`);
    }
    await file.execute(interaction, data);
  }
}
