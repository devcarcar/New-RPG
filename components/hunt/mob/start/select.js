import { EMBEDS } from "../../../../embeds/embed.js";
import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  MovementType,
  createBattleField,
} from "../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  const { opt1, opt2 } = await EMBEDS.MOVEMENT_AND_ACTION();
  await EMBEDS.REFRESH_BATTLEFIELD_MAIN(
    interaction.token,
    createBattleField(sessionData.data.grid)
  );
  const { embeds, components } = await EMBEDS.HUNT_SELECT(opt1, opt2);
  await CreateFollowUpMessage(interaction.token, embeds, components);
}
