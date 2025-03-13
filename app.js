import "dotenv/config";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";
import { users } from "./schemas/user.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";
import { CaseType, ExploreOutcomeType } from "./utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { COMMANDS } from "./command.js";
import { COMPONENTS } from "./components.js";

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
    const userData = await users.findOne({ userId: user.id });

    if (!userData) return console.log("Account information!");

    const session = await sessions.findOne({ sessionId: userData.session });

    if (type === InteractionType.APPLICATION_COMMAND) {
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

      const { sessionId } = created;

      await users.findOneAndUpdate(
        { userId: user.id },
        {
          $set: {
            session: sessionId,
          },
        }
      );

      switch (req.body.data.name) {
        case "gather":
          await COMMANDS.gather(req, user, {
            sessionId: sessionId,
            userData: userData,
          });
          break;
        case "hunt":
          await COMMANDS.hunt(req, user, {
            sessionId: sessionId,
            userData: userData,
          });
          break;
        case "explore":
          await COMMANDS.explore(req, user, { sessionId: sessionId });
          break;
        case "guild":
          await COMMANDS.guild(req, user, { sessionId: sessionId });
          break;
        case "item":
          await COMMANDS.item(req, user, { sessionId: sessionId });
          break;
        default:
          throw new Error("Unknown command " + req.body.data.name);
      }
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      });

      const { data } = req.body;
      const formatted =
        data.component_type === MessageComponentTypes.BUTTON
          ? data.custom_id.split("_")
          : { custom_id: data.custom_id, value: data.values[0].split("_") };

      if (
        (formatted?.value[2] != userData.session &&
          formatted[2] != userData.session) ||
        new Date(session.expireAt).getTime() < Date.now()
      )
        return console.log("Session expired");

      if (data.component_type === MessageComponentTypes.STRING_SELECT) {
        switch (formatted.value[0]) {
          case "hunt":
            if (formatted.custom_id === "movement_bar") {
              await COMPONENTS.HUNT.movement(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted.custom_id === "action_bar") {
              await COMPONENTS.HUNT.action(req, {
                user: user,
                formatted: formatted,
              });
            } else {
              await COMPONENTS.HUNT.choose(req, {
                user: user,
                formatted: formatted,
              });
            }
            break;
          case "explore":
            await COMPONENTS.EXPLORE.option(req, {
              user: user,
              formatted: formatted,
            });
            break;
          case "item":
            await COMPONENTS.ITEM.choose(req, {
              formatted: formatted,
              user: user,
            });
            break;
          default:
            throw new Error("Unknown custom id " + formatted[0]);
        }
      } else if (data.component_type === MessageComponentTypes.BUTTON) {
        switch (formatted[0]) {
          case "hunt":
            if (formatted[1] === "start") {
              await COMPONENTS.HUNT.start(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted[1] === "select") {
              await COMPONENTS.HUNT.select(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted[1] === "confirm") {
              await COMPONENTS.HUNT.confirm(req, {
                user: user,
                formatted: formatted,
              });
            }
            break;
          case "explore":
            if (formatted[1] === "start") {
              await COMPONENTS.EXPLORE.start(req, {
                user: user,
                formatted: formatted,
              });
            } else {
              await COMPONENTS.EXPLORE.next(req, {
                user: user,
                formatted: formatted,
              });
            }
            break;
          default:
            throw new Error("Unknown custom id " + formatted[0]);
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
