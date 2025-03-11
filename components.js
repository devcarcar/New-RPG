import "dotenv/config";
import { MessageComponentTypes } from "discord-interactions";
import { select_action } from "./components/buttons/hunt/hunt_select.js";
import { choose_mob } from "./components/string_selects/hunt/hunt_choose.js";
import { gather_start } from "./storage/gather_start.js";
import { hunt_start } from "./components/buttons/hunt/hunt_start.js";
import { movement_bar } from "./components/string_selects/hunt/movement_bar.js";
import { hunt_confirm } from "./components/buttons/hunt/hunt_confirm.js";
import { action_bar } from "./components/string_selects/hunt/action_bar.js";
import { explore_start } from "./components/buttons/explore/explore_start.js";
import { explore_next } from "./components/buttons/explore/explore_next.js";
import { explore_option } from "./components/string_selects/explore/explore_option.js";

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
        await explore_option(req, {
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
          await hunt_start(req, {
            user: user,
            formatted: formatted,
          });
        } else if (formatted[1] === "select") {
          await select_action(req, {
            user: user,
            formatted: formatted,
          });
        } else if (formatted[1] === "confirm") {
          await hunt_confirm(req, { user: user, formatted: formatted });
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
          await explore_start(req, {
            user: user,
            formatted: formatted,
          });
        } else {
          await explore_next(req, {
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
