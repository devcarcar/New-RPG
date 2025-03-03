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
export const Direction = {
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
      return Direction.LEFT;
    } else if (distanceX < 0) {
      return Direction.RIGHT;
    }
  } else {
    if (distanceY > 0) {
      return Direction.DOWN;
    } else if (distanceY < 0) {
      return Direction.UP;
    }
  }
}

export function movementHandler(movement1, movement2, user1, user2) {
  switch (movement1) {
    case Direction.UP:
      if (user1.y + 1 != user2.y || user1.x != user2.x) user1.y++;
      break;
    case Direction.DOWN:
      if (user1.y - 1 != user2.y || user1.x != user2.x) user1.y--;
      break;
    case Direction.LEFT:
      if (user1.x - 1 != user2.x || user1.y != user2.y) user1.x--;
      break;
    case Direction.RIGHT:
      if (user1.x + 1 != user2.x || user1.y != user2.y) user1.x++;
      break;
    default:
      break;
  }
  switch (movement2) {
    case Direction.UP:
      if (user1.y != user2.y + 1 || user1.x != user2.x) user2.y++;
      break;
    case Direction.DOWN:
      if (user1.y != user2.y - 1 || user1.x != user2.x) user2.y--;
      break;
    case Direction.LEFT:
      if (user1.x != user2.x - 1 || user1.y != user2.y) user2.x--;
      break;
    case Direction.RIGHT:
      if (user1.x != user2.x + 1 || user1.y != user2.y) user2.x++;
      break;
    default:
      break;
  }
  return {
    user1,
    user2,
  };
}
export function actionHandler(action1, action2, user1, user2) {
  switch (action1) {
    case "attack":
      user2.health -= user1.attack;
      break;
  }

  return {
    user1,
    user2,
  };
}

export function parseMovement(movement) {
  switch (movement) {
    case Direction.DOWN:
      return "down";
    case Direction.UP:
      return "up";
    case Direction.LEFT:
      return "left";
    case Direction.RIGHT:
      return "right";
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
