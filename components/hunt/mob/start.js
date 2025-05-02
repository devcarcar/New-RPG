import {
  ActionType,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  MovementType,
  createBattleField,
  createBattleFieldData,
  mobList,
} from "../../../utils";

export async function execute(interaction, data) {
  const found = mobList.find((mob) => mob.id === interaction.value);
  const bfData = createBattleFieldData();
  const desc = createBattleField(bfData);
  let opt1 = [
    {
      label: "No movement",
      description: "No movement at all",
      value: MovementType.NO_MOVEMENT,
    },
    {
      label: "Right",
      description: "Right.",
      value: MovementType.RIGHT,
    },
    {
      label: "Left",
      description: "No one moves left.",
      value: MovementType.LEFT,
    },
    {
      label: "Up",
      description: "Go up",
      value: MovementType.UP,
    },
    {
      label: "Down",
      description: "Go down",
      value: MovementType.DOWN,
    },
  ];
  let opt2 = [
    {
      value: ActionType.NO_ACTION,
      label: "No action",
      description: "No action at all",
    },
    {
      value: ActionType.ATTACK,
      label: "Attack",
      description: "Attack the enemy",
    },
  ];
  await EditMessage(
    interaction.token,
    [DefaultEmbed("Hunting", desc)],
    [
      DefaultStringSelect("hunt/mob/start/movement", opt1),
      DefaultStringSelect("hunt/mob/start/action", opt2),
    ]
  );
}
