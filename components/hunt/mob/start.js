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
  const desc = createBattleField(bfData);
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: bfData,
      },
    }
  );
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", desc)],
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
}
