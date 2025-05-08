import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  MovementType,
} from "../utils.js";

export const EMBEDS = {
  HUNT_SELECT: async (opt1, opt2, data) => {
    let str;
    if (!data) {
      str = "Select an action below";
    } else {
      const { movement, action } = data;
      str = `Your movement: ${
        MovementType[movement] ?? "No movement"
      }\nYour action: ${ActionType[action] ?? "No action"}`;
    }
    return {
      embeds: [DefaultEmbed("Hunting", str)],
      components: [
        DefaultStringSelect(
          "hunt/mob/start/select/movement",
          "Select a movement",
          [
            {
              label: "No movement",
              description: "No movement at all",
              value: MovementType.NO_MOVEMENT,
            },
            {
              label: "Right",
              description: "Right.",
              value: MovementType.RIGHT,
            },
            {
              label: "Left",
              description: "No one moves left.",
              value: MovementType.LEFT,
            },
            {
              label: "Up",
              description: "Go up",
              value: MovementType.UP,
            },
            {
              label: "Down",
              description: "Go down",
              value: MovementType.DOWN,
            },
          ]
        ),
        DefaultStringSelect(
          "hunt/mob/start/select/action",
          "Select an action",
          [
            {
              value: ActionType.NO_ACTION,
              label: "No action",
              description: "No action at all",
            },
            {
              value: ActionType.ATTACK,
              label: "Attack",
              description: "Attack the enemy",
            },
          ]
        ),
        DefaultStringSelect("hunt/mob/start/select/@", "Confirm", [
          {
            value: "confirm",
            label: "Confirm",
            description: "Confirm your moves",
          },
        ]),
      ],
    };
  },

  REFRESH_BATTLEFIELD_MAIN: async (token, description) => {
    await EditMessage(
      token,
      [DefaultEmbed("Hunting", description)],
      [
        DefaultStringSelect("hunt/mob/start/select", "Select an action", [
          {
            value: "useless",
            label: "Select Action",
            description: "Select your movement and action",
          },
        ]),
      ]
    );
  },
  TOOL_AND_BAIT: (opt1, opt2) => {
    return [
      DefaultStringSelect("fish/start/tool", "Select a tool", opt1),
      DefaultStringSelect("fish/start/bait", "Select a bait", opt2),
      DefaultStringSelect("fish/start/@", "Confirmation", [
        {
          label: "Catch",
          value: "catch",
          description: "Catch",
        },
        {
          label: "Back",
          value: "@fish",
          description: "Go back",
        },
      ]),
    ];
  },
};
