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
};
