import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { choose_mob } from "./components/string_selects/hunt/hunt_choose.js";
import { gather_start } from "./storage/gather_start.js";
import { movement_bar } from "./components/string_selects/hunt/movement_bar.js";
import { action_bar } from "./components/string_selects/hunt/action_bar.js";
import { EXPLORE_BUTTONS } from "./components/buttons/explore.js";
import { EXPLORE_STRING_SELECTS } from "./components/string_selects/explore.js";
import { HUNT_BUTTONS } from "./components/buttons/hunt.js";
const HUNT_COMPONENTS = {
  ...HUNT_BUTTONS,
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
          await movement_bar(req, {
            user: user,
            formatted: formatted,
          });
        } else if (formatted.custom_id === "action_bar") {
          await action_bar(req, {
            user: user,
            formatted: formatted,
          });
        } else {
          await choose_mob(req, {
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
