import { COMPONENTS } from "../../../../builders/components.js";
import { EMBEDS } from "../../../../builders/embeds.js";
import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  GridType,
  MovementType,
  createBattleField,
  findGridLocation,
} from "../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", createBattleField(sessionData.data.grid))],
    [
      DefaultStringSelect("hunt/mob/start/select", "Select an action", [
        {
          value: "useless",
          label: "Select Action",
          description: "Select your movement and action",
        },
      ]),
    ]
  );
  const embeds = EMBEDS.HUNT_SELECT();
  const components = COMPONENTS.HUNT_SELECT(
    findGridLocation(sessionData.data.grid, GridType.PLAYER1)
  );
  await CreateFollowUpMessage(interaction.token, embeds, components);
}
