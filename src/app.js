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
      const formatted = req.body.data.custom_id.split("_");
      const userData = await users.findOne({
        userId: user.id,
      });
      //   if (formatted[2] != userData.session) return;
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
        feature: formatted[0],
        sub_feature: formatted[1],
        value: req.body.data.values[0],
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
    if (interaction.sub_feature.startsWith("@")) {
      file = await import(
        `../components/${interaction.feature}/${sessionData.state}/${interaction.value}`
      );
    } else {
      file = await import(
        `../components/${interaction.feature}/${sessionData.state}/${interaction.sub_feature}`
      );
    }
    await file.execute(interaction, data);
  }
}
