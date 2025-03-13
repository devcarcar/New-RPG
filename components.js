import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { EXPLORE_BUTTONS } from "./components/buttons/explore.js";
import { EXPLORE_STRING_SELECTS } from "./components/string_selects/explore.js";
import { HUNT_BUTTONS } from "./components/buttons/hunt.js";
import { HUNT_STRING_SELECTS } from "./components/string_selects/hunt.js";
const HUNT_COMPONENTS = {
  ...HUNT_BUTTONS,
  ...HUNT_STRING_SELECTS,
};
const EXPLORE_COMPONENTS = {
  ...EXPLORE_BUTTONS,
  ...EXPLORE_STRING_SELECTS,
};

export async function componentHandler(req, user, userData) {
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
