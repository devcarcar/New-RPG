import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const tribe = new Schema({
  tribeId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  name: { type: String, required: true, unique: true },
});

export const tribes = model("tribe", tribe);
