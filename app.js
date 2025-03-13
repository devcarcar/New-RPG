import "dotenv/config";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";
import { users } from "./schemas/user.js";
import { componentHandler } from "./components.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";
import { CaseType, ExploreOutcomeType } from "./utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { EXPLORE_BUTTONS } from "./components/buttons/explore.js";
import { EXPLORE_STRING_SELECTS } from "./components/string_selects/explore.js";
import { HUNT_BUTTONS } from "./components/buttons/hunt.js";
import { HUNT_STRING_SELECTS } from "./components/string_selects/hunt.js";
import { explore } from "./commands/explore.js";

const HUNT_COMPONENTS = {
  ...HUNT_BUTTONS,
  ...HUNT_STRING_SELECTS,
};
const EXPLORE_COMPONENTS = {
  ...EXPLORE_BUTTONS,
  ...EXPLORE_STRING_SELECTS,
};

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
          await gather(req, user, {
            sessionId: sessionId,
            userData: userData,
          });
          break;
        case "hunt":
          await hunt(req, user, { sessionId: sessionId, userData: userData });
          break;
        case "explore":
          await explore(req, user, { sessionId: sessionId });
          break;
        case "guild":
          await guild(req, user, { sessionId: sessionId });
          break;
        case "item":
          await item(req, user, { sessionId: sessionId });
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

      if (data.component_type === MessageComponentTypes.STRING_SELECT) {
        switch (formatted.value[0]) {
          case "hunt":
            if (formatted.custom_id === "movement_bar") {
              await HUNT_COMPONENTS.movement(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted.custom_id === "action_bar") {
              await HUNT_COMPONENTS.action(req, {
                user: user,
                formatted: formatted,
              });
            } else {
              await HUNT_COMPONENTS.choose(req, {
                user: user,
                formatted: formatted,
              });
            }
            break;
          case "explore":
            await EXPLORE_COMPONENTS.option(req, {
              user: user,
              formatted: formatted,
            });
            break;
          default:
            throw new Error("Unknown custom id " + formatted[0]);
        }
      } else if (data.component_type === MessageComponentTypes.BUTTON) {
        switch (formatted[0]) {
          case "hunt":
            if (formatted[1] === "start") {
              await HUNT_COMPONENTS.start(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted[1] === "select") {
              await HUNT_COMPONENTS.select(req, {
                user: user,
                formatted: formatted,
              });
            } else if (formatted[1] === "confirm") {
              await HUNT_COMPONENTS.confirm(req, {
                user: user,
                formatted: formatted,
              });
            }
            break;
          case "gather":
            await gather_start(req, {
              user: user,
              formatted: formatted,
            });
            break;
          case "explore":
            if (formatted[1] === "start") {
              await EXPLORE_COMPONENTS.start(req, {
                user: user,
                formatted: formatted,
              });
            } else {
              await EXPLORE_COMPONENTS.next(req, {
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
