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
              const last =
                sessionData.data.log[sessionData.data.log.length - 1].data;
              const action =
                last.action != null
                  ? "Your action is " + last.action
                  : "You haven't selected your action yet";
              const movement =
                last.movement != null
                  ? "Your movement is " + last.movement
                  : "You haven't selected your movement yet";
              let opt = [
                {
                  label: "No movement",
                  value: `hunt_${Movement.NO_MOVEMENT}_${formatted[2]}`,
                  description: "No movement",
                },
              ];
              let x = sessionData.data.user1.x;
              let y = sessionData.data.user1.y;
              if (x > 1)
                opt.push({
                  label: "Left",
                  value: `hunt_${Movement.LEFT}_${formatted[2]}`,
                  description: "Move left",
                });
              if (x < 5)
                opt.push({
                  label: "Right",
                  value: `hunt_${Movement.RIGHT}_${formatted[2]}`,
                  description: "Move right",
                });
              if (y > 1)
                opt.push({
                  label: "Down",
                  value: `hunt_${Movement.DOWN}_${formatted[2]}`,
                  description: "Move down",
                });
              if (y < 5)
                opt.push({
                  label: "Up",
                  value: `hunt_${Movement.UP}_${formatted[2]}`,
                  description: "Move up",
                });

              await DiscordRequest(
                `/webhooks/${process.env.APP_ID}/${sessionData.token}`,
                {
                  method: "POST",
                  body: {
                    flags: 64,
                    embeds: [
                      {
                        title: "Select Action",
                        description:
                          last.action == null && last.movement == null
                            ? "Select an action to perform"
                            : `${movement}\n${action}`,
                      },
                    ],
                    components: [
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.STRING_SELECT,
                            custom_id: "movement_bar",
                            placeholder: "Select a movement",
                            min_value: 1,
                            max_value: 1,
                            options: opt,
                          },
                        ],
                      },
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.STRING_SELECT,
                            custom_id: "action_bar",
                            placeholder: "Select an action",
                            min_value: 1,
                            max_value: 1,
                            options: [
                              {
                                label: "No Action",
                                value: `hunt_${Action.NO_ACTION}_${formatted[2]}`,
                                description: "No Action",
                              },
                              {
                                label: "Attack",
                                value: `hunt_${Action.ATTACK}_${formatted[2]}`,
                                description: "Attack!",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.BUTTON,
                            custom_id: `hunt_confirm_${formatted[2]}`,
                            label: "Confirm",
                            style: ButtonStyleTypes.SECONDARY,
                            disabled:
                              last.action == null || last.movement == null
                                ? true
                                : false,
                          },
                        ],
                      },
                    ],
                  },
                }
              );
            } else if (formatted[1] === "confirm") {
              const { userData, sessionData, locationData } = options;
              const last =
                sessionData.data.log[sessionData.data.log.length - 1];
              const turn = sessionData.data.log.length;
              let { user2 } = sessionData.data;
              let text = "";
              movementHandler(last.data.movement, sessionData.data.user1, text);
              actionHandler(
                last.data.action,
                sessionData.data.user1,
                sessionData.data.user2,
                text
              );

              sessionData.data.log.push({
                turn: turn + 1,
                user: 2,
                data: {
                  movement: move(
                    sessionData.data.user1.x,
                    sessionData.data.user1.y,
                    user2.x,
                    user2.y
                  ),
                  action: "attack",
                },
              });

              sessionData.data.user2 = user2;
              await sessions.findOneAndUpdate(
                { sessionId: userData.session },
                {
                  $set: {
                    data: sessionData.data,
                  },
                }
              );
              const updated = await sessions.findOne({
                sessionId: userData.session,
              });
              const { data } = updated;
              await EditMessage(req.body.token, {
                method: "DELETE",
              });
              if (updated.data.user2.health <= 0)
                return DiscordRequest(
                  `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                  {
                    method: "PATCH",
                    body: {
                      embeds: [
                        {
                          title: "Victory!",
                          description: "You are rewarded with:",
                        },
                      ],
                      components: [],
                    },
                  }
                );
              await DiscordRequest(
                `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                {
                  method: "PATCH",
                  body: {
                    embeds: [
                      {
                        title: "You are in a battle!",
                        description:
                          text +
                          getGrid(
                            data.user1.x,
                            data.user1.y,
                            data.user2.x,
                            data.user2.y
                          ),
                        fields: [
                          {
                            name: data.user1.name,
                            value: `Health: ${data.user1.health}\nAttack: ${data.user1.attack}\nDefense: ${data.user1.defense}`,
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
                    components: [
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.BUTTON,
                            custom_id: `hunt_next_${formatted[2]}`,
                            label: "Next",
                            style: ButtonStyleTypes.SECONDARY,
                          },
                        ],
                      },
                    ],
                  },
                }
              );
            } else if (formatted[1] === "next") {
              const last =
                sessionData.data.log[sessionData.data.log.length - 1];
              const turn = sessionData.data.log.length;
              let { user1 } = sessionData.data;
              let text = "";
              movementHandler(last.data.movement, sessionData.data.user2, text);
              actionHandler(
                last.data.action,
                sessionData.data.user2,
                sessionData.data.user1,
                text
              );

              sessionData.data.log.push({
                turn: turn + 1,
                user: 1,
                data: {
                  movement: undefined,
                  action: undefined,
                },
              });

              await sessions.findOneAndUpdate(
                { sessionId: userData.session },
                {
                  $set: {
                    data: sessionData.data,
                  },
                }
              );
              const updated = await sessions.findOne({
                sessionId: userData.session,
              });
              if (updated.data.user1.health <= 0)
                return DiscordRequest(
                  `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                  {
                    method: "PATCH",
                    body: {
                      embeds: [
                        {
                          title: "Defeat!",
                          description: "You get nothing",
                        },
                      ],
                      components: [],
                    },
                  }
                );
              const data = updated.data;
              await DiscordRequest(
                `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                {
                  method: "PATCH",
                  body: {
                    embeds: [
                      {
                        title: "You are in a battle!",
                        description:
                          text +
                          getGrid(
                            data.user1.x,
                            data.user1.y,
                            data.user2.x,
                            data.user2.y
                          ),
                        fields: [
                          {
                            name: user1.name,
                            value: `Health: ${user1.health}\nAttack: ${user1.attack}\nDefense: ${user1.defense}`,
                            inline: true,
                          },
                          {
                            name: sessionData.data.user2.name,
                            value: `Health: ${sessionData.data.user2.health}\nAttack: ${sessionData.data.user2.attack}\nDefense: ${sessionData.data.user2.defense}`,
                            inline: true,
                          },
                        ],
                      },
                    ],
                    components: [
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.BUTTON,
                            custom_id: `hunt_select_${formatted[2]}`,
                            label: "Select",
                            style: ButtonStyleTypes.SECONDARY,
                          },
                        ],
                      },
                    ],
                  },
                }
              );
            }
            break;
          case "explore":
            if (formatted[1] === "start") {
              let { data } = sessionData;
              data.case = 0;
              data.rewards = [];
              await sessions.findOneAndUpdate(
                {
                  sessionId: userData.session,
                },
                {
                  $set: {
                    data: data,
                  },
                }
              );
              let arr = [];
              const currentCase = sessionData.data.cases[0];
              currentCase.options.forEach((option) => {
                arr.push({
                  label: option.name,
                  value: `explore_${option.id}_${formatted[2]}`,
                  description: option.description,
                });
              });
              await DiscordRequest(
                `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                {
                  method: "PATCH",
                  body: {
                    embeds: [
                      {
                        title: currentCase.name,
                        description: currentCase.description,
                        footer: {
                          text: "Step: 1/3",
                        },
                      },
                    ],
                    components: [
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.STRING_SELECT,
                            custom_id: "option_pick",
                            placeholder: "Select an option",
                            min_value: 1,
                            max_value: 1,
                            options: arr,
                          },
                        ],
                      },
                    ],
                  },
                }
              );
            } else if (formatted[1] == "next") {
              let data = sessionData.data;
              data.case += 1;
              await sessions.findOneAndUpdate(
                {
                  sessionId: userData.session,
                },
                {
                  $set: {
                    data: data,
                  },
                }
              );
              let arr = [];
              let aaa = "";
              data.rewards.forEach((r) => (aaa += `${r}\n`));
              const currentCase = sessionData.data.cases[data.case];
              if (!currentCase)
                return await DiscordRequest(
                  `webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                  {
                    method: "PATCH",
                    body: {
                      embeds: [
                        {
                          title: "You have finished the exploration!",
                          description: `Rewards: ${aaa}`,
                        },
                      ],
                      components: [],
                    },
                  }
                );
              currentCase.options.forEach((option) =>
                arr.push({
                  label: option.name,
                  value: `explore_${option.id}_${formatted[2]}`,
                  description: option.description,
                })
              );
              await DiscordRequest(
                `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
                {
                  method: "PATCH",
                  body: {
                    embeds: [
                      {
                        title: currentCase.name,
                        description: currentCase.description,
                        footer: {
                          text: `Step: ${data.case + 1}/3`,
                        },
                      },
                    ],
                    components: [
                      {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                          {
                            type: MessageComponentTypes.STRING_SELECT,
                            custom_id: "option_pick",
                            placeholder: "Select an option",
                            min_value: 1,
                            max_value: 1,
                            options: arr,
                          },
                        ],
                      },
                    ],
                  },
                }
              );
            }
            break;
          default:
            throw new Error("Unknown custom id " + formatted);
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
