import { MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../utils.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
} from "../../utils.js";
const locations = [
  {
    id: "starter_island",
    name: "Starter Island",
    description: "The island where everything started",
    reqLevel: 0,
    here: false,
  },
  {
    id: "sunset_sands",
    name: "Sunset Sands",
    description: "better ig",
    reqLevel: 10,
    here: true,
  },
];
export async function execute(interaction, data) {
  const found = locations.find((l) => interaction.value === l.id);
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed(found.name, found.description)],
    [
      DefaultStringSelect("map/@", [
        {
          value: "gt",
          label: "Go there",
          description: "Go over there",
        },
      ]),
    ]
  );
}
