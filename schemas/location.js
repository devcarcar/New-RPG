import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const location = new Schema({
  locationId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
  },
});

export const locations = model("location", location);
