import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const pet = new Schema({
  petId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  owner: { type: String, required: true },
  type: { type: Number, required: true },
  name: { type: String, required: true },
  hunger: { type: Number, default: 100 },
  happiness: { type: Number, default: 100 },
  affection: { type: Number, default: 25 },
  skills: { type: Array, default: [] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  evolution: { type: Number, default: 0 },
});

export const pets = model("pet", pet);
