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
  locationData: {
    gather: [
      {
        name: "Apple Tree Grove",
        time: 5,
        chance: 0.6,
        drop: "Apple",
      },
      {
        name: "Chicken Coop",
        time: 20,
        chance: 0.6,
        drop: "Egg",
      },
      {
        name: "Abondoned Fishing Hut",
        time: 8,
        chance: 0.6,
        drop: "Cod",
      },
      {
        name: "Iron Mine",
        time: 30,
        chance: 0.4,
        drop: "Iron",
      },
      {
        name: "Wheat Field",
        time: 10,
        chance: 0.8,
        drop: "Wheat",
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
