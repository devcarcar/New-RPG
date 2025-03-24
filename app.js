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

    const locationData = await locations.findOne({
      locationId: userData.location,
    });

    if (type === InteractionType.APPLICATION_COMMAND) {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });
      const created = await sessions.create({
        command: data.name,
        token: req.body.token,
        createdAt: Date.now(),
        expireAt: Date.now() + 15 * 60 * 1000,
        data: {
          case: 0,
          cases: [],
          rewards: [],
        },
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
          await COMMANDS.gather(req, user, sessionId, {
            userData,
            created,
            locationData,
          });
          break;
        case "hunt":
          await COMMANDS.hunt(req, user, sessionId, {
            userData,
            created,
            locationData,
          });
          break;
        case "explore":
          await COMMANDS.explore(req, user, sessionId, {
            userData,
            created,
            locationData,
          });
          break;
        case "guild":
          await COMMANDS.guild(req, user, sessionId, {
            userData,
            created,
            locationData,
          });
          break;
        case "item":
          await COMMANDS.item(req, user, sessionId, {
            userData,
            created,
            locationData,
          });
          break;
        default:
          throw new Error("Unknown command " + req.body.data.name);
      }
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      });

      const sessionData = await sessions.findOne({
        sessionId: userData.session,
      });
      const { data } = req.body;
      const formatted =
        data.component_type === MessageComponentTypes.BUTTON
          ? data.custom_id.split("_")
          : { custom_id: data.custom_id, value: data.values[0].split("_") };
      if (data.component_type === MessageComponentTypes.STRING_SELECT) {
        if (
          formatted.value[2] != userData.session ||
          new Date(sessionData.expireAt).getTime() < Date.now()
        )
          return console.log(formatted.value[2], userData.session);
        switch (formatted.value[0]) {
          case "hunt":
            if (formatted.custom_id === "movement_bar") {
              await COMPONENTS.HUNT.movement(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted.custom_id === "action_bar") {
              await COMPONENTS.HUNT.action(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else {
              await COMPONENTS.HUNT.choose(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            }
            break;
          case "explore":
            await COMPONENTS.EXPLORE.option(req, user, formatted, {
              userData,
              sessionData,
              locationData,
            });
            break;
          case "item":
            await COMPONENTS.ITEM.choose(req, user, formatted, {
              userData,
              sessionData,
              locationData,
            });
            break;
          default:
            throw new Error("Unknown custom id " + formatted.value[0]);
        }
      } else if (data.component_type === MessageComponentTypes.BUTTON) {
        if (
          formatted[2] != userData.session ||
          new Date(sessionData.expireAt).getTime() < Date.now()
        )
          return console.log(formatted[2], userData.session);
        switch (formatted[0]) {
          case "hunt":
            if (formatted[1] === "start") {
              await COMPONENTS.HUNT.start(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted[1] === "select") {
              await COMPONENTS.HUNT.select(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted[1] === "confirm") {
              await COMPONENTS.HUNT.confirm(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted[1] === "next") {
              await COMPONENTS.HUNT.next(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            }
            break;
          case "explore":
            if (formatted[1] === "start") {
              await COMPONENTS.EXPLORE.start(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else {
              await COMPONENTS.EXPLORE.next(req, user, formatted, {
                userData,
                sessionData,
                locationData,
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
    hunt: [
      {
        id: "goblin",
        name: "Goblin",
        description: "That's a lot of green",
        data: {
          health: 10,
          attack: 5,
          defense: 1,
        },
      },
    ],
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
