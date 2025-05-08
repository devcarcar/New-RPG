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
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  await DeleteMessage(interaction.token);
  const updated = await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: HandleMoves(sessionData.data),
      },
    },
    {
      new: true,
    }
  );

  await EditMessage(
    sessionData.token,
    [DefaultEmbed("Hunting", createBattleField(updated.data))],
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
