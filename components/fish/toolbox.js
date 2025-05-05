import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultEmbed,
  DefaultNavigationBar,
  DefaultStringSelect,
  EditMessage,
} from "../../utils.js";
import { users } from "../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { toolbox } = userData.fish;
  if (toolbox.length === 0) {
    return EditMessage(
      interaction.token,
      [DefaultEmbed("Fishing Toolbox", "Your toolbox is empty")],
      [DefaultNavigationBar("fish")]
    );
  }
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing Toolbox", "Select a toolbox option")],
    [
      DefaultStringSelect("fish/toolbox/@", "Select a toolbox option", [
        {
          value: "view",
          label: "View",
          description: "View your tools",
        },
        {
          value: "repair",
          label: "Repair",
          description: "Repair your tools",
        },
        {
          value: "manage",
          label: "Manage",
          description: "Manage your tools",
        },
      ]),
    ]
  );
}
