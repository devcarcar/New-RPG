import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const command = new Schema({
  commandId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

export const commands = model("command", command);
