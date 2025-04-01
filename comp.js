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
        if (true) {
          const found = locationData.data.gather.find(
            (i) => i.id === formatted.value[1]
          );
          await EditMessage(
            sessionData.token,
            DefaultEmbed("Gathering", found.description),
            DefaultButton({
              type: MessageComponentTypes.BUTTON,
              custom_id: `gather_${found.id}_${formatted.value[2]}`,
              label: "Start",
              style: ButtonStyleTypes.SECONDARY,
            })
          );
        }
        break;
      case "hunt":
        if (formatted.custom_id === "movement_bar") {
          const movement = parseInt(formatted.value[1]);
          const last = sessionData.data.log[sessionData.data.log.length - 1];
          last.data.movement = movement;
          const log = sessionData.data.log;
          log[sessionData.data.length - 1] = last;
          const data = sessionData.data;
          data.log = log;
          await sessions.findOneAndUpdate(
            { sessionId: sessionData.sessionId },
            {
              set: {
                data: data,
              },
            }
          );
          let opt = [
            {
              label: "No movement",
              value: `hunt_${Movement.NO_MOVEMENT}_${formatted.value[2]}`,
              description: "No movement",
            },
          ];
          let x = sessionData.data.user1.x;
          let y = sessionData.data.user1.y;
          MovementBar(x, y, formatted.value[2], opt);
          const news = await sessions.findOne({
            sessionId: sessionData.sessionId,
          });
          const shortcut = news.data.log[news.data.log.length - 1].data;
          const action =
            shortcut.action != null
              ? "Your action is " + shortcut.action
              : "You haven't selected your action yet";
          const condition =
            shortcut.movement != null && shortcut.action != null ? false : true;

          await EditMessage(
            `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
            [
              {
                title: `Select Action`,
                description: `Your movement is ${parseMovement(
                  movement
                )}\n${action}`,
              },
            ],
            [
              DefaultStringSelect("movement_bar", opt),
              DefaultStringSelect("action_bar", [
                {
                  label: "No Action",
                  value: `hunt_${Action.NO_ACTION}_${formatted.value[2]}`,
                  description: "No action",
                },
                {
                  label: "Attack",
                  value: `hunt_${Action.ATTACK}_${formatted.value[2]}`,
                  description: "Attack!",
                },
              ]),
              DefaultButton({
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_confirm_${formatted.value[2]}`,
                label: "Confirm",
                style: ButtonStyleTypes.SECONDARY,
                disabled: condition,
              }),
            ]
          );
        } else if (formatted.custom_id === "action_bar") {
          const action = formatted.value[1];
          const last = sessionData.data.log[sessionData.data.log.length - 1];
          last.data.action = action;
          const log = sessionData.data.log;
          log[sessionData.data.length - 1] = last;
          const data = sessionData.data;
          data.log = log;
          await sessions.findOneAndUpdate(
            { sessionId: sessionData.sessionId },
            {
              $set: {
                data: data,
              },
            }
          );
          let opt = [
            {
              label: "No movement",
              value: `hunt_${Movement.NO_MOVEMENT}_${formatted.value[2]}`,
              description: "No movement",
            },
          ];
          let x = sessionData.data.user1.x;
          let y = sessionData.data.user1.y;
          MovementBar(x, y, formatted.value[2], opt);
          const news = await sessions.findOne({
            sessionId: sessionData.sessionId,
          });
          const shortcut = news.data.log[news.data.log.length - 1].data;
          const movement =
            shortcut.movement != null
              ? "Your movement is " + parseMovement(parseInt(shortcut.movement))
              : "You haven't selected your movement yet";
          const condition =
            shortcut.movement != null && shortcut.action != null ? false : true;

          await EditMessage(
            req.body.token,
            DefaultEmbed(
              `Select Action`,
              `${movement}\n Your action is ${action}`
            ),
            [
              DefaultStringSelect("movement_bar", opt),
              DefaultStringSelect([
                {
                  label: "No Action",
                  value: `hunt_${Action.NO_ACTION}_${formatted.value[2]}`,
                  description: "No action",
                },
                {
                  label: "Attack",
                  value: `hunt_${Action.ATTACK}_${formatted.value[2]}`,
                  description: "Attack!",
                },
              ]),
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `hunt_confirm_${formatted.value[2]}`,
                    label: "Confirm",
                    style: ButtonStyleTypes.SECONDARY,
                    disabled: condition,
                  },
                ],
              },
            ]
          );
        } else if (formatted.custom_id === "choose_mob") {
          const mobList = [
            { id: "goblin", name: "Goblin", description: "Goblin aa" },
          ];
          const found = mobList.find((mob) => mob.id === formatted.value[1]);
          await sessions.findOneAndUpdate(
            {
              sessionId: formatted.value[2],
            },
            {
              $set: {
                data: {
                  log: [
                    {
                      turn: 1,
                      user: 1,
                      data: {
                        movement: undefined,
                        action: undefined,
                      },
                    },
                  ],
                  user1: {
                    type: "player",
                    id: user.id,
                    name: user.username,
                    x: 1,
                    y: 1,
                    health: 25,
                    attack: 10,
                    defense: 5,
                  },
                  user2: {
                    type: "mob",
                    id: found.id,
                    name: found.name,
                    x: 5,
                    y: 5,
                    health: 25,
                    attack: 15,
                    defense: 5,
                  },
                },
              },
            }
          );
          await EditMessage(
            sessionData.token,
            [DefaultEmbed(found.name, found.description)],
            [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT,
                    custom_id: "choose_mob",
                    min_values: 1,
                    max_values: 1,
                    options: [
                      {
                        value: `hunt_goblin_${formatted.value[2]}`,
                        label: "Goblin",
                        description: "Goblin",
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
                    custom_id: `hunt_start_${formatted.value[2]}`,
                    label: "Start",
                    style: ButtonStyleTypes.SECONDARY,
                  },
                ],
              },
            ]
          );
        }
        break;
      case "explore":
        const data = sessionData.data;
        const explore = locationData.data.explore;
        let found;
        for (let i = 0; i < explore.length; i++) {
          for (let j = 0; j < explore[i].options.length; j++) {
            if (explore[i].options[j].id == formatted.value[1])
              found = explore[i].options[j];
          }
        }
        const result =
          found.outcome[Math.floor(Math.random() * found.outcome.length)];

        let text;
        let v = result.values[0];
        switch (result.type) {
          case ExploreOutcomeType.REWARD:
            text = `You have received ${v.amount} ${v.type}`;
            data.rewards.push(`${v.amount} ${v.type}`);
            break;
          default:
            break;
        }
        try {
          await sessions.findOneAndUpdate(
            {
              sessionId: sessionData.sessionId,
            },
            {
              $set: {
                data: data,
              },
            }
          );
        } catch (error) {
          throw new Error(error);
        }

        await EditMessage(
          sessionData.token,
          [
            {
              title: `Exploration`,
              description: text,
              footer: {
                text: `Step: ${data.case + 1}/3`,
              },
            },
          ],
          DefaultButton({
            type: MessageComponentTypes.BUTTON,
            style: ButtonStyleTypes.SECONDARY,
            label: "Next",
            custom_id: `explore_next_${formatted.value[2]}`,
          })
        );
        break;
      case "item":
        const category = formatted[1];
        await EditMessage(
          sessionData.token,
          [DefaultEmbed(category, "Items:\nApple")],
          []
        );
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
            DefaultEmbed(
              "Gathering",
              `You started gathering @${found.name} for ${
                found.drop.name
              }\nYou will be ready in <t:${
                Math.floor(Date.now() / 1000) + found.time
              }:R>`
            ),
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

          await EditMessage(
            sessionData.token,
            [
              DefaultEmbed(
                "Select Action",
                last.action == null && last.movement == null
                  ? "Select an action to perform"
                  : `${movement}\n${action}`
              ),
            ],
            [
              DefaultStringSelect("movement_bar", opt),
              DefaultStringSelect("action_bar", [
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
              ]),
              DefaultButton({
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_confirm_${formatted[2]}`,
                label: "Confirm",
                style: ButtonStyleTypes.SECONDARY,
                disabled:
                  last.action == null || last.movement == null ? true : false,
              }),
            ]
          );
        } else if (formatted[1] === "confirm") {
          const { userData, sessionData, locationData } = options;
          const last = sessionData.data.log[sessionData.data.log.length - 1];
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
          const updated = await sessions.findOneAndUpdate(
            { sessionId: userData.session },
            {
              $set: {
                data: sessionData.data,
              },
            },
            {
              returnNewDocument: true,
            }
          );
          const { data } = updated;
          await DiscordRequest(req.body.token, {
            method: "DELETE",
          });
          if (updated.data.user2.health <= 0)
            return EditMessage(
              sessionData.token,
              [DefaultEmbed("Victory!", "You are rewarded with:")],
              []
            );
          await EditMessage(
            sessionData.token,
            [
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
            [
              DefaultButton({
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_next_${formatted[2]}`,
                label: "Next",
                style: ButtonStyleTypes.SECONDARY,
              }),
            ]
          );
        } else if (formatted[1] === "next") {
          const last = sessionData.data.log[sessionData.data.log.length - 1];
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
            return EditMessage(
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
          await EditMessage(
            sessionData.token,
            [
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
            [
              DefaultButton({
                type: MessageComponentTypes.BUTTON,
                custom_id: `hunt_select_${formatted[2]}`,
                label: "Select",
                style: ButtonStyleTypes.SECONDARY,
              }),
            ]
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
          let opt = [];
          const currentCase = sessionData.data.cases[0];
          currentCase.options.forEach((option) => {
            opt.push({
              label: option.name,
              value: `explore_${option.id}_${formatted[2]}`,
              description: option.description,
            });
          });
          await EditMessage(
            sessionData.token,
            [
              {
                title: currentCase.name,
                description: currentCase.description,
                footer: {
                  text: "Step: 1/3",
                },
              },
            ],
            [DefaultStringSelect("option_pick", opt)]
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
            return await EditMessage(
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
          await EditMessage(
            sessionData.token,
            [
              {
                title: currentCase.name,
                description: currentCase.description,
                footer: {
                  text: `Step: ${data.case + 1}/3`,
                },
              },
            ],
            [DefaultStringSelect("option_pick", arr)]
          );
        }
        break;
      default:
        throw new Error("Unknown custom id " + formatted);
    }
  }
}
