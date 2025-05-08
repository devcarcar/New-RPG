import { COMPONENTS } from "../../../builders/components.js";
import { EMBEDS } from "../../../builders/embeds.js";
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
              turn: 1,
              user1: {
                movement: undefined,
                action: undefined,
              },
              user2: {
                movement: MovementType.DOWN,
                action: ActionType.ATTACK,
              },
            },
          ],
        },
      },
    }
  );

  await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", createBattleField(bfData))],
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
  const components = COMPONENTS.HUNT_SELECT();
  await EditMessage(interaction.token, embeds, components);
}
