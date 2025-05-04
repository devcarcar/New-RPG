import { EMBEDS } from "../../../../../embeds/embed.js";
import { sessions } from "../../../../../schemas/session.js";
import {
  ActionType,
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  MovementType,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  sessionData.data.turns[sessionData.data.turns.length - 1].movement =
    interaction.value;
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
  const { opt1, opt2 } = await EMBEDS.MOVEMENT_AND_ACTION();
  const { embeds, components } = await EMBEDS.HUNT_SELECT(
    opt1,
    opt2,
    updated.data.turns[updated.data.turns.length - 1]
  );
  await EditMessage(interaction.token, embeds, components);
}
