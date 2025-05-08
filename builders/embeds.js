import { ActionType, DefaultEmbed, MovementType } from "../utils.js";

export const EMBEDS = {
  HUNT_SELECT: (data) => {
    let str;
    if (!data) {
      str = "Select an action below";
    } else {
      const { movement, action } = data;
      str = `Your movement: ${movement ?? "No movement"}\nYour action: ${
        action ?? "No action"
      }`;
    }
    return [DefaultEmbed("Hunting", str)];
  },
  UPDATE_HUNT_SELECT: (data) => {
    return [DefaultEmbed()];
  },
};
