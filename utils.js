import "dotenv/config";
export async function DiscordRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      //  "User-Agent":
      //  "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export function questComplete() {
  let constant;
  if (constant) return true;
  else return false;
}
export const Movement = {
  NO_MOVEMENT: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
  UP: 4,
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

export function movementHandler(movement1, user1, user2) {
  switch (movement1) {
    case Movement.DOWN:
      if (user1.y - 1 !== user2.y || user1.x !== user2.x) user1.y--;
      break;
    case Movement.LEFT:
      if (user1.x - 1 !== user2.x || user1.y !== user2.y) user1.x--;
      break;
    case Movement.UP:
      if (user1.y + 1 !== user2.y || user1.x !== user2.x) user1.y++;
      break;
    case Movement.RIGHT:
      if (user1.x + 1 !== user2.x || user1.y !== user2.y) user1.x++;
      break;
    default:
      break;
  }
  return user1;
}
export function actionHandler(action1, user1, user2) {
  let text;
  switch (action1) {
    case "attack":
      if (Math.abs(user1.x - user2.x) + Math.abs(user1.y - user2.y) <= 1) {
        text = `${user1.name} dealt ${user1.attack} damage to ${user2.name}!\n`;
        user2.health -= user1.attack;
      } else {
        text = `${user1.name} didn't do any damage due to out of reach\n`;
      }
      break;
  }

  return {
    user1,
    text,
  };
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

export async function DefaultCommandResponse(token, embed, components) {
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embed,
        components,
      },
    }
  );
}

export async function DefaultEmbed(title, description) {
  return {
    title: title,
    description: description,
  };
}

export const ExploreOutcomeType = {
  REWARD: 0,
};
