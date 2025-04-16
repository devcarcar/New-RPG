import { MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../utils.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
} from "../../utils.js";
const locations = [
  {
    id: "starterisland",
    name: "Starter Island",
    description: "Island",
    reqLevel: 0,
    here: false,
  },
  {
    id: "secondisland",
    name: "Second Island",
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
      DefaultStringSelect("map_@bbar", [
        {
          value: "gt",
          label: "Go there",
          description: "Go over there",
        },
      ]),
    ]
  );
}
