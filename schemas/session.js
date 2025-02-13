import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const session = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  token: { type: String, required: true },
  command: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expireAt: { type: Date, required: true },
  data: { type: Object },
});

export const sessions = model("session", session);
