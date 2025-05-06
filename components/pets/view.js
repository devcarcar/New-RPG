import { pets } from "../../schemas/pet.js";
import { DefaultEmbed, DefaultStringSelect, EditMessage } from "../../utils.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { pets: userPets } = userData;
  let str = "";
  let opt = [];
  for (let i = 0; i < userPets.length; i++) {
    const pet = await pets.findOne({ petId: userPets[i] });
    str += `${pet.name} - Level: ${pet.level}\n`;
    opt.push({
      value: pet.petId,
      label: pet.name,
      description: `Type: ${pet.type}`,
    });
  }
  return EditMessage(
    interaction.token,
    [DefaultEmbed("Pets", str)],
    [DefaultStringSelect("pets/view/pet", "Select a pet to view", opt)]
  );
}
