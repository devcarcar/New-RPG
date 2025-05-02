import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  mobList,
} from "../../utils.js";

export async function execute(interaction, data) {
  const found = mobList.find((mob) => mob.id === interaction.value);
  let opt = [];
  mobList.forEach((mob) =>
    opt.push({ label: mob.name, value: mob.id, description: mob.description })
  );
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", found.description)],
    [
      DefaultStringSelect("hunt/mob", "Select a monster to go against", opt),
      DefaultStringSelect("hunt/mob/start", "Select an option", [
        {
          label: "Start",
          value: found.id,
          description: `Start a battle against ${found.name}`,
        },
      ]),
    ]
  );
}
