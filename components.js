import { MessageComponentTypes } from "discord-interactions";
import { DiscordRequest } from "./utils.js";
import "dotenv/config";
("./locations.js");
import { select_action } from "./components/select_action.js";
import { choose_mob } from "./components/choose_mob.js";
import { gather_start } from "./components/gather_start.js";
import { hunt_start } from "./components/hunt_start.js";
import { movement_bar } from "./components/movement_bar.js";

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
        } else {
          await choose_mob(req, {
            user: user,
            formatted: formatted,
          });
        }
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
        }
        break;
      case "gather":
        await gather_start(req, {
          user: user,
          formatted: formatted,
        });
        break;
      default:
        throw new Error("Unknown custom id " + formatted[0]);
    }
  }
}
