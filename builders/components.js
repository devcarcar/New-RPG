import { DefaultStringSelect } from "../utils";

export const COMPONENTS = {
  TOOL_AND_BAIT: (opt1, opt2) => {
    return [
      DefaultStringSelect("fish/start/tool", "Select a tool", opt1),
      DefaultStringSelect("fish/start/bait", "Select a bait", opt2),
      DefaultStringSelect("fish/start/@", "Select an option", [
        {
          label: "Catch",
          value: "catch",
          description: "Catch",
        },
        {
          label: "Back",
          value: "@fish",
          description: "Go back",
        },
      ]),
    ];
  },
  BUCKETS_STRING_SELECT: () => {
    return [
      DefaultStringSelect("fish/buckets/@", "Select a buckets option", [
        {
          value: "cook",
          label: "Cook",
          description: "Cooking",
        },
        {
          value: "sell",
          label: "Sell",
          description: "Selling",
        },
        {
          value: "view",
          label: "View",
          description: "View your buckets",
        },
        {
          value: "@fish",
          label: "Back",
          description: "Go back",
        },
      ]),
    ];
  },
};
