import "dotenv/config";
import {
  ButtonStyleTypes,
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";
import { users } from "./schemas/user.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";

import {
  Action,
  CaseType,
  DefaultCommandResponse,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  ExploreOutcomeType,
  Movement,
  getGrid,
  sort,
} from "./utils.js";

import { MessageComponentTypes } from "discord-interactions";
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
    if (!userData) throw new Error("no user");
    const locationData = await locations.findOne({
      locationId: userData.location,
    });
    if (!locationData) throw new Error("no location");

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
          let opt = [];
          locationData.data.gather.forEach((i) => {
            opt.push({
              label: i.name,
              value: `gather_${i.id}_${sessionId}`,
              description: i.description,
            });
          });
          await DefaultCommandResponse(
            req.body.token,
            DefaultEmbed("Gathering", "Resource Gathering"),
            DefaultStringSelect("gather_bar", opt)
          );

          break;
        case "hunt":
          await DefaultCommandResponse(
            req.body.token,
            DefaultEmbed("Hunting", "Select a mob to attack"),
            DefaultStringSelect("choose_mob", [
              {
                value: `hunt_goblin_${sessionId}`,
                label: "Goblin",
                description: "Goblin",
              },
            ])
          );
          break;
        case "explore":
          const cases = sort(locationData.data.explore, 1);
          created.data.cases = cases;
          await sessions.findOneAndUpdate(
            {
              sessionId: created.sessionId,
            },
            {
              $set: {
                data: created.data,
              },
            }
          );
          await DefaultCommandResponse(
            req.body.token,
            DefaultEmbed("Exploring", "Start exploring nearby locations"),
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  custom_id: `explore_start_${sessionId}`,
                  label: "Start",
                  style: ButtonStyleTypes.SECONDARY,
                },
              ],
            }
          );
          break;
        case "guild":
          await DefaultCommandResponse(
            req.body.token,
            DefaultEmbed("Guild", "Guild Guild Guild"),
            DefaultStringSelect("guild_select", [
              {
                label: "Guild Hall",
                value: `guild_hall_${sessionId}`,
                description: "View guild info and legacies",
              },
              {
                label: "Members",
                value: `guild_members_${sessionId}`,
                description: "Check your guild members",
              },
              {
                label: "Manage Members",
                value: `guild_manage_${sessionId}`,
                description:
                  "Kick, demote, or promote members (Helpers and Leaders only)",
              },
              {
                label: "Guild Raid",
                value: `guild_raid_${sessionId}`,
                description: "Check guild raid status and details",
              },
            ])
          );
          break;
        case "item":
          await DefaultCommandResponse(
            req.body.token,
            DefaultEmbed("Item", "Find items"),
            DefaultStringSelect("item_choose", [
              {
                value: `item_fish_${sessionId}`,
                label: "Fish",
                description: "Check fishes",
              },
            ])
          );
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
      if (!sessionData) throw new Error("session error");
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
          return console.log(formatted, userData.session);
        switch (formatted.value[0]) {
          case "gather":
            await COMPONENTS.STRING_SELECTS.GATHER.choose(
              req,
              user,
              formatted,
              {
                userData,
                sessionData,
                locationData,
              }
            );
            break;
          case "hunt":
            if (formatted.custom_id === "movement_bar") {
              await COMPONENTS.STRING_SELECTS.HUNT.movement(
                req,
                user,
                formatted,
                {
                  userData,
                  sessionData,
                  locationData,
                }
              );
            } else if (formatted.custom_id === "action_bar") {
              await COMPONENTS.STRING_SELECTS.HUNT.action(
                req,
                user,
                formatted,
                {
                  userData,
                  sessionData,
                  locationData,
                }
              );
            } else {
              await COMPONENTS.STRING_SELECTS.HUNT.choose(
                req,
                user,
                formatted,
                {
                  userData,
                  sessionData,
                  locationData,
                }
              );
            }
            break;
          case "explore":
            await COMPONENTS.STRING_SELECTS.EXPLORE.option(
              req,
              user,
              formatted,
              {
                userData,
                sessionData,
                locationData,
              }
            );
            break;
          case "item":
            await COMPONENTS.STRING_SELECTS.ITEM.choose(req, user, formatted, {
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
          return console.log(formatted, userData.session);
        switch (formatted[0]) {
          case "gather":
            const found = locationData.data.gather.find(
              (i) => i.id === formatted[1]
            );
            await EditMessage(
              req.body.token,
              [
                {
                  title: "Gathering",
                  description: `You started gathering @${found.name} for ${
                    found.drop.name
                  }\nYou will be ready in <t:${
                    Math.floor(Date.now() / 1000) + found.time
                  }:R>`,
                },
              ],
              []
            );
            break;
          case "hunt":
            if (formatted[1] === "start") {
              const { user1, user2 } = sessionData.data;
              await EditMessage(
                req.body.token,
                [
                  {
                    title: "You are in a battle",
                    description: getGrid(user1.x, user1.y, user2.x, user2.y),
                    fields: [
                      {
                        name: user1.name,
                        value: `Health: ${user1.health}\nAttack: ${user1.attack}\nDefense: ${user1.defense}`,
                        inline: true,
                      },
                      {
                        name: user2.name,
                        value: `Health: ${user2.health}\nAttack: ${user2.attack}\nDefense: ${user2.defense}`,
                        inline: true,
                      },
                    ],
                  },
                ],
                [
                  {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                      {
                        type: MessageComponentTypes.BUTTON,
                        custom_id: `hunt_select_${formatted[2]}`,
                        label: "Select Action",
                        style: ButtonStyleTypes.SECONDARY,
                      },
                    ],
                  },
                ]
              );
            } else if (formatted[1] === "select") {
              await COMPONENTS.BUTTONS.HUNT.select(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted[1] === "confirm") {
              await COMPONENTS.BUTTONS.HUNT.confirm(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else if (formatted[1] === "next") {
              await COMPONENTS.BUTTONS.HUNT.next(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            }
            break;
          case "explore":
            if (formatted[1] === "start") {
              await COMPONENTS.BUTTONS.HUNT.start(req, user, formatted, {
                userData,
                sessionData,
                locationData,
              });
            } else {
              await COMPONENTS.BUTTONS.HUNT.next(req, user, formatted, {
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
    gather: [
      {
        id: "appletreegrove",
        name: "Apple Tree Grove",
        description: "Drops apple",
        drop: {
          id: "apple",
          name: "Apple",
        },
        time: 3 * 60,
      },
    ],
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
