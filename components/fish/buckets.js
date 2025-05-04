import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, DefaultStringSelect, EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";
import { COMPONENTS } from "../../builders/components.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing Buckets", "Select a buckets option")],
    COMPONENTS.BUCKETS_STRING_SELECT()
  );
}
