/*
      case "inventory":
      await inventory_fish(req, { user: user, sessionId: formatted[2] });
      break;
    case "explore":
      if (formatted[1] === "start") {
        await explore_start(req, { user: user, sessionId: formatted[2] });
      } else {
        await explore_continue(req, { user: user, sessionId: formatted[2] });
      }
      break;
    case "select_action":
      await select_action(req, { user: user, sessionId: formatted[2] });
      break;
    case "guild":
      if (formatted[1] === "hall") {
        await guild_hall(req, userData.session, user);
      }
      if (formatted[1] === "members") {
        await guild_members(req, userData.session, user);
      }
      if (formatted[1] === "manage") {
        await guild_manage(req, userData.session, user);
      }
      if (formatted[1] === "raid") {
        await guild_raid(req, userData.session, user);
      }
      break;
    case "quest":
      const command2 = formatted[1].split("-");
      if (command2[1] === "a") {
        return await DiscordRequest(
          `/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`,
          {
            method: "PATCH",
            body: {
              embeds: [
                {
                  title: "Quest accepted",
                  description: "Your quest",
                },
              ],
            },
          }
        );
      }
      await quest_browse(req, { user: user, sessionId: formatted[2] });
      break;
   */
