import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const session = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },

  data: {
    type: Object,
    default: {},
    required: true,
  },
  token: { type: String },
});

export const sessions = model("session", session);
