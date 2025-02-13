import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const guild = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  guildName: { type: String, required: true, unique: true },
  Members: {
    type: Array,
    required: true,
    default: [
      {
        userId: "xxx",
        role: 2,
      },
      {
        userId: "xxy",
        role: 1,
      },
      {
        userId: "yxy",
        role: 0,
      },
    ],
  },

  guildRaid: {
    type: Object,
  },
  Trophies: { type: Number, required: true, default: 0 },
});

export const guilds = model("guild", guild);
