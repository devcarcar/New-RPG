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
          opt1
        ),
        DefaultStringSelect(
          "hunt/mob/start/select/action",
          "Select an action",
          opt2
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
  MOVEMENT_AND_ACTION: async () => {
    return {
      opt1: [
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
      ],
      opt2: [
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
};
