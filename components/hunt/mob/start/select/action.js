import { COMPONENTS } from "../../../../../builders/components.js";
import { EMBEDS } from "../../../../../builders/embeds.js";
import { sessions } from "../../../../../schemas/session.js";
import {
  EditMessage,
  GridType,
  findGridLocation,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  sessionData.data.turns[sessionData.data.turns.length - 1].user1.action =
    parseInt(interaction.value);
  const updated = await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: sessionData.data,
      },
    },
    {
      new: true,
    }
  );
  const embeds = EMBEDS.HUNT_SELECT(
    updated.data.turns[updated.data.turns.length - 1].user1
  );
  const components = COMPONENTS.HUNT_SELECT(
    findGridLocation(updated.data.grid, GridType.PLAYER1)
  );
  await EditMessage(interaction.token, embeds, components);
}
