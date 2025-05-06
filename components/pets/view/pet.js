import { pets } from "../../../schemas/pet.js";
import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
} from "../../../utils.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const pet = await pets.findOne({ petId: interaction.value });
  return EditMessage(
    interaction.token,
    [
      DefaultEmbed(
        pet.name,
        `Happiness: ${pet.happiness}\nHunger: ${pet.hunger}\n Affection: ${pet.affection}`
      ),
    ],
    [
      DefaultStringSelect("pets/view/pet/@", "Select a pet option", [
        {
          value: "a",
          label: "a",
          description: "a",
        },
      ]),
    ]
  );
}
