import { sessions } from "../../../../../schemas/session.js";
import { users } from "../../../../../schemas/user.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultNavigationBar,
  DefaultStringSelect,
  EditMessage,
} from "../../../../../utils.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  let { toolbox } = userData.fish;
  const { tool } = sessionData.data;
  toolbox = toolbox.map((t) => {
    if (t.id === tool.id) t.durability++;
    return t;
  });
  userData.fish.toolbox = toolbox;
  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $set: {
        fish: userData.fish,
      },
    }
  );
  return await EditMessage(
    interaction.token,
    [
      DefaultEmbed(
        "Repaired!",
        `You have repaired ${tool.name}!\nNew durability: ${tool.durability}`
      ),
    ],
    []
  );
}
