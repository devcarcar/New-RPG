import {
  DefaultCommandResponse,
  DefaultEmbed,
  DefaultStringSelect,
} from "../utils";

async function execute() {
  await DefaultCommandResponse(
    req.body.token,
    DefaultEmbed("Hunting", "Select a mob to attack"),
    DefaultStringSelect("choose_mob", [
      {
        value: `hunt_goblin_${sessionId}`,
        label: "Goblin",
        description: "Goblin",
      },
    ])
  );
}
