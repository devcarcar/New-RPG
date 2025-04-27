import { Schema, model } from "mongoose";

const user = new Schema({
  userId: { type: String, required: true, unique: true },
  //
  log: { type: Array, default: [], required: true },
  //
  createdAt: { type: Date, default: () => Date.now(), required: true },
  commandsUsed: { type: Number, default: 0, required: true },
  //
  gathering: { type: Map, default: {}, required: true },
  //
  gold: { type: Number, required: true, default: 500 },
  cooldowns: { type: Map, required: true, default: [] },
  equipments: { type: Array, required: true, default: [] },
  location: { type: String, default: "starter_island", required: true },
  inventory: { type: Map, default: {}, required: true },
  session: { type: String, default: "", required: true },
  xp: { type: Number, default: 0, required: true },
  level: { type: Number, default: 1, required: true },
  tribe: { type: String, default: "No tribe", required: true },
});

export const users = model("user", user);
