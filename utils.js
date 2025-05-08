import "dotenv/config";
import {
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";

export async function DiscordRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export const Movement = {
  NO_MOVEMENT: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
  UP: 4,
};
export const Action = {
  NO_ACTION: 0,
  ATTACK: 1,
};
export function move(x1, y1, x2, y2) {
  const manhattanDistance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  if (manhattanDistance === 1) return 0;
  const distanceX = x2 - x1;
  const distanceY = y2 - y1;
  let newX = x2;
  let newY = y2;
  if (Math.abs(distanceX) >= Math.abs(distanceY)) {
    if (distanceX > 0) {
      return Movement.LEFT;
    } else if (distanceX < 0) {
      return Movement.RIGHT;
    }
  } else {
    if (distanceY > 0) {
      return Movement.DOWN;
    } else if (distanceY < 0) {
      return Movement.UP;
    }
  }
}

export function movementHandler(movement, user, text) {
  text += "You moved ";
  switch (movement) {
    case Movement.DOWN:
      user.y--;
      text += "down";
      break;
    case Movement.LEFT:
      user.x--;
      text += "left";
      break;
    case Movement.UP:
      user.y++;
      text += "up";
      break;
    case Movement.RIGHT:
      user.x++;
      text += "right";
      break;
    case Movement.NO_MOVEMENT:
      text = "You chose to not move";
      break;
  }
  text += "\n";
}
export function actionHandler(action, user1, user2, text) {
  switch (parseInt(action)) {
    case Action.NO_ACTION:
      text += `${user1.name} selected to not do anything`;
      break;
    case Action.ATTACK:
      if (Math.abs(user1.x - user2.x) + Math.abs(user1.y - user2.y) <= 1) {
        text += `${user1.name} dealt ${user1.attack} damage to ${user2.name}!`;
        user2.health -= user1.attack;
      } else {
        text += `${user1.name} didn't do any damage due to out of reach`;
      }
      break;
  }

  text += "\n";
}

export function parseMovement(movement) {
  switch (movement) {
    case Movement.DOWN:
      return "down";
    case Movement.UP:
      return "up";
    case Movement.LEFT:
      return "left";
    case Movement.RIGHT:
      return "right";
    case Movement.NO_MOVEMENT:
      return "no movement";
  }
}

export function sort(input, amount) {
  let final = [];
  for (let i = 0; i < amount; i++) {
    let random = Math.floor(Math.random() * input.length);
    while (final.includes(input[random])) {
      random = Math.floor(Math.random() * input.length);
    }
    final.push(input[random]);
  }
  return final;
}

export function getGrid(x1, y1, x2, y2) {
  let str = "";
  for (let y = 5; y >= 1; y--) {
    for (let x = 1; x <= 5; x++) {
      if (x == x1 && y == y1) {
        str += ":man:";
      } else if (x == x2 && y == y2) {
        str += ":skull:";
      } else {
        str += ":black_large_square:";
      }
    }
    str += "\n";
  }
  return str;
}

export const CaseType = {
  OPTION: 0,
  COMBAT: 1,
};

export async function EditMessage(token, embeds, components) {
  const res = await fetch(
    `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json; charset=UTF-8",
        "User-Agent":
          "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
      },
      body: JSON.stringify({
        embeds: embeds,
        components: components,
      }),
    }
  );
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
}
export async function DeleteMessage(token) {
  const res = await fetch(
    `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
}

export async function CreateFollowUpMessage(token, embeds, components) {
  const res = await fetch(
    `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json; charset=UTF-8",
        "User-Agent":
          "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
      },
      body: JSON.stringify({
        embeds: embeds,
        components: components,
        flags: InteractionResponseFlags.EPHEMERAL,
      }),
    }
  );
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
}

export function DefaultEmbed(title, description) {
  return {
    title: title,
    description: description,
  };
}

export function DefaultButton(button) {
  return {
    type: MessageComponentTypes.ACTION_ROW,
    components: [button],
  };
}
export function DefaultStringSelect(custom_id, placeholder, options) {
  return {
    type: MessageComponentTypes.ACTION_ROW,
    components: [
      {
        type: MessageComponentTypes.STRING_SELECT,
        custom_id: custom_id,
        min_values: 1,
        max_values: 1,
        placeholder: placeholder,
        options: options,
      },
    ],
  };
}
export function DefaultNavigationBar(destination) {
  return DefaultStringSelect("@", "Select an option", [
    {
      value: destination,
      label: "Back",
      description: "Go back",
    },
  ]);
}

export const ExploreOutcomeType = {
  REWARD: 0,
};

export function MovementBar(x, y, id, opt) {
  if (x > 1)
    opt.push({
      label: "Left",
      value: `hunt_${Movement.LEFT}_${id}`,
      description: "Move left",
    });
  if (x < 5)
    opt.push({
      label: "Right",
      value: `hunt_${Movement.RIGHT}_${id}`,
      description: "Move right",
    });
  if (y > 1)
    opt.push({
      label: "Down",
      value: `hunt_${Movement.DOWN}_${id}`,
      description: "Move down",
    });
  if (y < 5)
    opt.push({
      label: "Up",
      value: `hunt_${Movement.UP}_${id}`,
      description: "Move up",
    });
}

export const ItemTypes = {
  FRUIT: 0,
};
export const FishingToolTypes = {
  TRAP: 1,
  ROD: 2,
  NET: 3,
  SPEAR: 4,
};

export const baits = [
  {
    id: "common_bait",
    name: "Common Bait",
    description: "aa",
  },
];

export const tools = [
  {
    id: "lobster_trap",
    name: "Lobster Trap",
    description: "..",
    type: FishingToolTypes.TRAP,
    catches: [
      {
        id: "lobster",
        name: "Lobster",
        lowest: 15,
        highest: 21,
        chance: 1,
      },
    ],
  },
];

export const islands = [
  {
    id: "starter_island",
    name: "Starter Island",
    description: "The island where everything started",
    reqLevel: 0,
  },
  {
    id: "sunset_sands",
    name: "Sunset Sands",
    description: "better ig",
    reqLevel: 10,
  },
];

export function randomElement(arr) {
  let random = Math.random();
  let multiplier = 0;
  for (let i = 0; i < arr.length; i++) {
    multiplier += arr[i].chance;
    if (multiplier > random) return arr[i];
  }
}

export const mobList = [
  {
    id: "sand_golem",
    name: "Sand Golem",
    description: "aaa",
  },
  {
    id: "slime",
    name: "Slime",
    description: "a slime",
  },
];
let GridType = {
  NOTHING: 0,
  PLAYER1: 1,
  ENEMY: 2,
  SPAWNABLE: 3,
};
export function createBattleFieldData() {
  let grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push([]);
    for (let j = 0; j < 5; j++) {
      grid[i].push({ type: GridType.NOTHING });
    }
  }
  grid[0][0] = {
    type: GridType.PLAYER1,
    data: {
      health: 25,
      attack: 10,
      defense: 5,
    },
  };
  grid[4][4] = {
    type: GridType.ENEMY,
    data: {
      health: 25,
      attack: 10,
      defense: 5,
    },
  };
  return grid;
}

export function createBattleField(data) {
  let str = "";
  for (let i = 4; i >= 0; i--) {
    for (let j = 0; j < 5; j++) {
      switch (data[i][j].type) {
        case GridType.ENEMY:
          str += ":skull:";
          break;
        case GridType.PLAYER1:
          str += ":man:";
          break;
        default:
          str += ":black_large_square:";
          break;
      }
    }
    str += "\n";
  }
  return str;
}

export const MovementType = {
  NO_MOVEMENT: 0,
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4,
};

export const ActionType = {
  NO_ACTION: 0,
  ATTACK: 1,
};

export const toolList = [
  {
    id: "fishing_rod",
    name: "Fishing Rod",
    description: "Normal rod",
  },
];

export const SIX_HOURS = 6 * 60 * 60 * 1000;

export const TWENTY_MINUTES = 20 * 60 * 1000;

export function findGridLocation(data, target) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (data[i][j] === target) {
        return {
          x: i,
          y: j,
        };
      }
    }
  }
}
export function HandleMoves(data) {
  const last = data.turns[data.turns.length - 1];
  const { x: user1x, y: user1y } = findGridLocation(
    data.grid,
    GridType.PLAYER1
  );
  const { x: user2x, y: user2y } = findGridLocation(data.grid, GridType.ENEMY);
  const user1 = data.grid[user1x][user1y];
  const user2 = data.grid[user2x][user2y];
  let verdict = "";

  switch (last.user1.action) {
    case ActionType.ATTACK:
      const damage = Math.max(user1.attack - user2.defense, 5);
      user2.health -= damage;
      verdict += `user1 dealt ${damage} damage to user2.\n user2 now have ${user2.health} health.\n`;
      break;
  }
  switch (last.user2.action) {
    case ActionType.ATTACK:
      const damage = Math.max(user2.attack - user1.defense, 5);
      user1.health -= damage;
      verdict += `user2 dealt ${damage} damage to user1.\n user1 now have ${user1.health} health.\n`;
      break;
  }
  switch (last.user1.movement) {
    case MovementType.UP:
      data.grid[user1x][user1y] = { type: GridType.NOTHING };
      data.grid[user1x + 1][user1y] = {
        type: GridType.PLAYER1,
        data: user1.data,
      };
      verdict += `user1 moved up\n`;
      break;
  }
  switch (last.user2.movement) {
    case MovementType.UP:
      data.grid[user2x][user2y] = { type: GridType.NOTHING };
      data.grid[user2x + 1][user2y] = {
        type: GridType.ENEMY,
        data: user2.data,
      };
      verdict += `user2 moved up\n`;
      break;
  }

  return data;
}
