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
  const { data: newData } = sessionData;
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
    [DefaultEmbed("Hunting", createBattleField(newData))],
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
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed("Hunting", "Select an action below")],
    [
      DefaultStringSelect(
        "hunt/mob/start/select/movement",
        "Select a movement",
        opt1
      ),
      DefaultStringSelect(
        "hunt/mob/start/select/action",
        "Select an action",
        opt2
      ),
      DefaultStringSelect("hunt/mob/start/select/@", "Confirm", [
        {
          value: "confirm",
          label: "Confirm",
          description: "Confirm your moves",
        },
      ]),
    ]
  );
}
