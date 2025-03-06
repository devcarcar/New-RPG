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
  guildRaid: { type: Object, required: true },
  trophies: { type: Number, required: true, default: 0 },
});

export const guilds = model("guild", guild);
