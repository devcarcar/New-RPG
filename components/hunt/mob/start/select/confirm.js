import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  DeleteMessage,
  EditMessage,
  MovementType,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  await DeleteMessage(interaction.token);
  await EditMessage(
    sessionData.token,
    [
      {
        title,
        description,
      },
    ],
    []
  );
}
