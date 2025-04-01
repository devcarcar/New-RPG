import "dotenv/config";
import {
  ButtonStyleTypes,
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import mongoose from "mongoose";
import { users } from "./schemas/user.js";
import { sessions } from "./schemas/session.js";
import { locations } from "./schemas/location.js";

import {
  Action,
  CaseType,
  DefaultButton,
  DefaultCommandResponse,
  DefaultEmbed,
  DefaultStringSelect,
  DiscordRequest,
  EditMessage,
  ExploreOutcomeType,
  Movement,
  MovementBar,
  getGrid,
  sort,
} from "./utils.js";

import { MessageComponentTypes } from "discord-interactions";
import { commands } from "./schemas/command.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    const { type, data } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    const context = req.body.context;
    const user = context === 0 ? req.body.member.user : req.body.user;
    const userData = await users.findOne({ userId: user.id });
    if (!userData) throw new Error("no user");
    const locationData = await locations.findOne({
      locationId: userData.location,
    });
    if (!locationData) throw new Error("no location");

    if (type === InteractionType.APPLICATION_COMMAND) {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });
      /*
      const created = await sessions.create({
        command: data.name,
        token: req.body.token,
        createdAt: Date.now(),
        expireAt: Date.now() + 15 * 60 * 1000,
        data: {
          case: 0,
          cases: [],
          rewards: [],
        },
      });

      const { sessionId } = created;
*/
      await users.findOneAndUpdate(
        { userId: user.id },
        {
          $set: {
            session: sessionId,
          },
        }
      );
      const interaction = {
        commandId: req.body.data.name,
        req: req,
        user: user,
      };
      const data = {
        userData: userData,
        sessionData: created,
        locationData: locationData,
      };
      await CommandHandler.execute(interaction, data);
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      const interaction = {
        componentId: data.custom_id.split("_"),
        value: data.values[0].split("_"),
        req: req,
        user: user,
      };
      const data = {
        userData: userData,
        sessionData: sessionData,
        locationData: locationData,
      };
      await ComponentHandler.execute(interaction, data);
    }
  }
);
app.use(express.json());
app.post("/db", async (req, res) => {
  try {
    const { database, operation, query, data } = req.body;

    if (!database || !operation) {
      return res
        .status(400)
        .send("Missing 'database' or 'operation' in request body.");
    }

    let result;
    const dbModel = {
      users: users,
      sessions: sessions,
      locations: locations,
    }[database];

    if (!dbModel) {
      return res.status(400).send("Invalid database specified.");
    }

    switch (operation.toLowerCase()) {
      case "findone":
        result = await dbModel.findOne(query || {});
        break;
      case "insert":
        result = await dbModel.create(data);
        break;
      case "update":
        result = await dbModel.updateOne(query, { $set: data });
        break;
      case "delete":
        result = await dbModel.deleteOne(query);
        break;
      default:
        return res.status(400).send("Invalid operation.");
    }

    console.log(`Database operation '${operation}' on '${database}':`, result);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
/*
await fetch("https://18a3-223-17-144-77.ngrok-free.app/db", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    database: "sessions", // Collection name
    operation: "findone", // Operation type
    query: { sessionId: "a81b4646-88c9-468d-b814-fd0254bd1835" }, // Optional query filter
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
*/
mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

/*
await locations.create({
  locationId: "village",
  data: {
    gather: [
      {
        id: "appletreegrove",
        name: "Apple Tree Grove",
        description: "Drops apple",
        drop: {
          id: "apple",
          name: "Apple",
        },
        time: 3 * 60,
      },
    ],
    hunt: [
      {
        id: "goblin",
        name: "Goblin",
        description: "That's a lot of green",
        data: {
          health: 10,
          attack: 5,
          defense: 1,
        },
      },
    ],
    explore: [
      {
        type: CaseType.OPTION,
        id: "mbox",
        name: "Mystery Box",
        description: "Whats inside?",
        options: [
          {
            id: "open",
            name: "Open it",
            description: "Discover what's inside",
            outcome: [
              {
                type: ExploreOutcomeType.REWARD,
                values: [
                  {
                    type: "COIN",
                    amount: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
*/

class CommandHandler {
  static commands = [];
  static async execute(interaction, data) {
    const command = await loadCommand(interaction.commandId);
    await command.execute(interaction, data);
  }
}

class ComponentHandler {
  static components = [];
  static async execute(interaction, data) {
    const component = await loadComponent();
  }
}

async function loadCommand(commandId) {
  const metadata = await commands.findOne({ commandId: commandId });
  const module = await import(`./commands/${metadata.name}.js`);
  return {
    ...metadata,
    execute: module.execute,
  };
}

async function loadComponent(componentId) {
  const module = await import(
    `./components/${componentId[0]}/${componentId[1]}.js`
  );
  return {
    execute: module.execute,
  };
}
