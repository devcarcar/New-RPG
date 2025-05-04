import { EMBEDS } from "../../../embeds/embed.js";
import { sessions } from "../../../schemas/session.js";
import {
  ActionType,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  MovementType,
  createBattleField,
  createBattleFieldData,
  mobList,
} from "../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  const found = mobList.find((mob) => mob.id === interaction.value);
  const bfData = createBattleFieldData();

  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        token: interaction.token,
        data: {
          mob: found,
          grid: bfData,
          turns: [
            {
              type: 1,
              turn: 1,
              movement: undefined,
              action: undefined,
            },
          ],
        },
      },
    }
  );
  await EMBEDS.REFRESH_BATTLEFIELD_MAIN(
    interaction.token,
    createBattleField(bfData)
  );
  const { opt1, opt2 } = await EMBEDS.MOVEMENT_AND_ACTION();
  const { embeds, components } = await EMBEDS.HUNT_SELECT(opt1, opt2);
  await EditMessage(interaction.token, embeds, components);
}
