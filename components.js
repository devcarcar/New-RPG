import { EXPLORE_BUTTONS } from "./components/buttons/explore.js";
import { HUNT_BUTTONS } from "./components/buttons/hunt.js";
import { EXPLORE_STRING_SELECTS } from "./components/string_selects/explore.js";
import { HUNT_STRING_SELECTS } from "./components/string_selects/hunt.js";
import { ITEM_STRING_SELECTS } from "./components/string_selects/item.js";

const HUNT = {
  ...HUNT_BUTTONS,
  ...HUNT_STRING_SELECTS,
};

const EXPLORE = {
  ...EXPLORE_BUTTONS,
  ...EXPLORE_STRING_SELECTS,
};

const ITEM = {
  ...ITEM_STRING_SELECTS,
};

export const COMPONENTS = {
  EXPLORE,
  HUNT,
  ITEM,
};
