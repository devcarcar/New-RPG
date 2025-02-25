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
      return "left";
    } else if (distanceX < 0) {
      return "right";
    }
  } else {
    if (distanceY > 0) {
      return "down";
    } else if (distanceY < 0) {
      return "up";
    }
  }
}
