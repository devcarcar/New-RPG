import { sessions } from "../../../../../schemas/session.js";
import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  DeleteMessage,
  EditMessage,
  HandleMoves,
  MovementType,
  createBattleField,
  determineMovement,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  let d = HandleMoves(sessionData.data);
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
  await EditMessage(
    sessionData.token,
    [DefaultEmbed("Hunting", createBattleField(updated.data.grid))],
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
