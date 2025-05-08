import { ActionType, DefaultStringSelect, MovementType } from "../utils.js";

export const COMPONENTS = {
  TOOL_AND_BAIT: (opt) => {
    return [
      DefaultStringSelect("fish/start/tool", "Select a tool", opt),
      DefaultStringSelect("fish/start/@", "Select an option", [
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
  BUCKETS_STRING_SELECT: () => {
    return [
      DefaultStringSelect("fish/buckets/@", "Select a buckets option", [
        {
          value: "cook",
          label: "Cook",
          description: "Cooking",
        },
        {
          value: "sell",
          label: "Sell",
          description: "Selling",
        },
        {
          value: "view",
          label: "View",
          description: "View your buckets",
        },
        {
          value: "@fish",
          label: "Back",
          description: "Go back",
        },
      ]),
    ];
  },
  HUNT_SELECT: (input) => {
    const { x, y } = input;
    let opt = [
      {
        label: "No movement",
        description: "No movement at all",
        value: MovementType.NO_MOVEMENT,
      },
    ];
    if (x > 0)
      opt.push({
        label: "Left",
        description: "No one moves left.",
        value: MovementType.LEFT,
      });
    if (x < 4)
      opt.push({
        label: "Right",
        description: "Right.",
        value: MovementType.RIGHT,
      });
    if (y > 0)
      opt.push({
        label: "Up",
        description: "Go up",
        value: MovementType.UP,
      });
    if (y < 4)
      opt.push({
        label: "Down",
        description: "Go down",
        value: MovementType.DOWN,
      });
    return [
      DefaultStringSelect(
        "hunt/mob/start/select/movement",
        "Select a movement",
        opt
      ),
      DefaultStringSelect("hunt/mob/start/select/action", "Select an action", [
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
      ]),
      DefaultStringSelect("hunt/mob/start/select/@", "Confirm", [
        {
          value: "confirm",
          label: "Confirm",
          description: "Confirm your moves",
        },
      ]),
    ];
  },
};
