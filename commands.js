switch (req.body.data.name) {
  case "gather":
    let opt = [];
    locationData.data.gather.forEach((i) => {
      opt.push({
        label: i.name,
        value: `gather_${i.id}_${sessionId}`,
        description: i.description,
      });
    });
    await DefaultCommandResponse(
      req.body.token,
      DefaultEmbed("Gathering", "Resource Gathering"),
      DefaultStringSelect("gather_bar", opt)
    );

    break;
  case "hunt":
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
    break;
  case "explore":
    const cases = sort(locationData.data.explore, 1);
    created.data.cases = cases;
    await sessions.findOneAndUpdate(
      { sessionId: created.sessionId },
      {
        $set: {
          data: created.data,
        },
      }
    );
    await DefaultCommandResponse(
      req.body.token,
      DefaultEmbed("Exploring", "Start exploring nearby locations"),
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: `explore_start_${sessionId}`,
            label: "Start",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      }
    );
    break;
  case "guild":
    await DefaultCommandResponse(
      req.body.token,
      DefaultEmbed("Guild", "Guild Guild Guild"),
      DefaultStringSelect("guild_select", [
        {
          label: "Guild Hall",
          value: `guild_hall_${sessionId}`,
          description: "View guild info and legacies",
        },
        {
          label: "Members",
          value: `guild_members_${sessionId}`,
          description: "Check your guild members",
        },
        {
          label: "Manage Members",
          value: `guild_manage_${sessionId}`,
          description:
            "Kick, demote, or promote members (Helpers and Leaders only)",
        },
        {
          label: "Guild Raid",
          value: `guild_raid_${sessionId}`,
          description: "Check guild raid status and details",
        },
      ])
    );
    break;
  case "item":
    await DefaultCommandResponse(
      req.body.token,
      DefaultEmbed("Item", "Find items"),
      DefaultStringSelect("item_choose", [
        {
          value: `item_fish_${sessionId}`,
          label: "Fish",
          description: "Check fishes",
        },
      ])
    );
    break;
  default:
    throw new Error("Unknown command " + req.body.data.name);
}
