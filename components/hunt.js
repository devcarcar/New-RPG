import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  mobList,
} from "../utils.js";

export async function execute(interaction, data) {
  let opt = [];
  mobList.forEach((mob) =>
    opt.push({ label: mob.name, value: mob.id, description: mob.description })
  );
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", "Select a hunting mob")],
    [DefaultStringSelect("hunt/mob", "Select a monster to go against", opt)]
  );
}
