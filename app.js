import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import "dotenv/config";
import express from "express";
import { commandHandler } from "./command.js";
import mongoose from "mongoose";
import { DiscordRequest } from "./utils.js";
import { users } from "./schemas/user.js";
import { componentHandler } from "./components.js";
import { guilds } from "./storage/guild.schema.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";

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
    const context = req.body.context;
    const user = context === 0 ? req.body.member.user : req.body.user;
    let userData = await users.findOne({ userId: user.id });
    if (!userData) {
      userData = await users.create({ userId: user.id, session: "No session" });
    }
    switch (type) {
      case InteractionType.APPLICATION_COMMAND:
        res.send({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        const created = await sessions.create({
          command: data.name,
          token: req.body.token,
          createdAt: Date.now(),
          expireAt: Date.now() + 15 * 60 * 1000,
        });
        await users.findOneAndUpdate(
          { userId: user.id },
          {
            $set: {
              session: created.sessionId,
            },
          }
        );
        await commandHandler(req, user, userData, created.sessionId);
        break;
      case InteractionType.MESSAGE_COMPONENT:
        res.send({
          type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
        });
        await componentHandler(req, user, userData);
      default:
        break;
    }
  }
);

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

/*
await locations.create({
  locationId: "village",
  data: {
    gather: [
      {
        name: "Apple Tree Grove",
        max: 320,
        drop: "Apple",
      },
    ],
    hunt: [
      {
        id: "goblin",
        name: "Goblin",
        health: 25,
        attack: 10,
        defense: 5,
      },
    ],
 
    explore: [
      {
        CASE_NAME: "AAA",
        OPTIONS: [
          { OPTION_ID: "A", OPTION_DESCRIPTION: "AAAAA", OPTION_NAME: "AI" },
        ],
      },
    ],

  },
});
*/
