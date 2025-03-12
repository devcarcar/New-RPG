import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import "dotenv/config";
import express from "express";
import { commandHandler } from "./command.js";
import mongoose from "mongoose";
import { users } from "./schemas/user.js";
import { componentHandler } from "./components.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";
import { CaseType, ExploreOutcomeType } from "./utils.js";

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
          data: {},
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
        break;
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
    explore: [
      {
        type: CaseType.OPTION,
        id: "mbox",
        name: "Mystery Box",
        description: "Whats inside?",
        options: [
          {
            id: "open",
            name: "Open it",
            description: "Discover what's inside",
            outcome: [
              {
                type: ExploreOutcomeType.REWARD,
                values: [
                  {
                    type: "COIN",
                    amount: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
*/
