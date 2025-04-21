import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { CreateFollowUpMessage } from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
const arr = [
  {
    id: "cod",
    name: "Cod",
    weight: 4.59,
    unit: "kg", // Fish typically sold by weight
  },

  {
    id: "lobster",
    name: "Lobster",
    weight: 0.85, // Average weight
    unit: "kg", // Sold by weight
  },

  {
    id: "crab",
    name: "Crab",
    weight: 1.2, // Average weight
    unit: "kg", // Sold by weight
  },
];

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "/buckets/item",
    }
  );
  const found = arr.find((item) => item.id === interaction.value);
  return await CreateFollowUpMessage(
    interaction.token,
    [
      {
        title: found.name,
        description: `Weight: ${found.weight} ${found.unit}`,
      },
    ],
    []
  );
}
