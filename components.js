import { EXPLORE_BUTTONS } from "./components/buttons/explore.js";
import { GATHER_BUTTONS } from "./components/buttons/gather.js";
import { HUNT_BUTTONS } from "./components/buttons/hunt.js";
import { EXPLORE_STRING_SELECTS } from "./components/string_selects/explore.js";
import { GATHER_STRING_SELECTS } from "./components/string_selects/gather.js";
import { HUNT_STRING_SELECTS } from "./components/string_selects/hunt.js";
import { ITEM_STRING_SELECTS } from "./components/string_selects/item.js";

const STRING_SELECTS = {
  EXPLORE: EXPLORE_STRING_SELECTS,
  GATHER: GATHER_STRING_SELECTS,
  HUNT: HUNT_STRING_SELECTS,
  ITEM: ITEM_STRING_SELECTS,
};
const BUTTONS = {
  HUNT: HUNT_BUTTONS,
  GATHER: GATHER_BUTTONS,
  EXPLORE: EXPLORE_BUTTONS,
};

export const COMPONENTS = {
  STRING_SELECTS,
  BUTTONS,
};
