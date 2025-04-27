import { MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, EditMessage, ItemTypes, islands } from "../utils.js";
import { sessions } from "../schemas/session.js";
import { tribes } from "../schemas/tribe.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { tribe } = userData;
  if (tribe === "No tribe") {
    return await EditMessage(
      interaction.token,
      [
        {
          title: "Tribe",
          description: "You are not in a tribe!",
        },
      ],
      []
    );
  } else {
    const found = await tribes.findOne({ tribeId: tribe });
    return await EditMessage(
      interaction.token,
      [DefaultEmbed("Tribe", "Your tribe: " + found.name)],
      []
    );
  }
}
