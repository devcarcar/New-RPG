import { sessions } from "../../../../../schemas/session.js";
import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  DeleteMessage,
  EditMessage,
  GridType,
  HandleMoves,
  MovementType,
  createBattleField,
  determineMovement,
  findGridLocation,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  let { d, verdict } = HandleMoves(sessionData.data);
  d.turns.push({
    turn: d.turns.length + 1,
    user1: {
      movement: undefined,
      action: undefined,
    },
    user2: {
      movement: determineMovement(d.grid),
      action: ActionType.ATTACK,
    },
  });
  await DeleteMessage(interaction.token);
  const updated = await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: d,
      },
    },
    {
      new: true,
    }
  );
  const { x: x1, y: y1 } = findGridLocation(
    updated.data.grid,
    GridType.PLAYER1
  );
  const { x: x2, y: y2 } = findGridLocation(updated.data.grid, GridType.ENEMY);
  const user1 = updated.data.grid[y1][x1].data;
  const user2 = updated.data.grid[y2][x2].data;
  await EditMessage(
    sessionData.token,
    [
      {
        title: "Hunting",
        description: verdict + "\n" + createBattleField(updated.data.grid),
        fields: [
          {
            name: "user1",
            value: `Health: ${user1.health}\nAttack: ${user1.attack}\nDefense: ${user1.defense}`,
            inline: true,
          },
          {
            name: "user2",
            value: `Health: ${user2.health}\nAttack: ${user2.attack}\nDefense: ${user2.defense}`,
            inline: true,
          },
        ],
      },
    ],
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
