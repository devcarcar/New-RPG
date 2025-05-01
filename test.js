import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { ButtonStyle } from "discord.js";

const GridTypes = {
  FISH: 0,
  DUCK: 1,
  NOTHING: 2,
};
export function CreateGridData() {
  const fishs = [];

  for (let i = 0; i < 3; i++) {
    let random = Math.floor(Math.random() * 25);
    while (fishs.includes(random)) random = Math.floor(Math.random() * 25);
    fishs.push(random);
  }
  const possibleDuckSpots = [];
  for (let i = 0; i < 3; i++) {
    const x = fishs[i];
    // problem:: out of bounds if such that x - 1 or x - 5 < 0 ........
    if (
      !(
        possibleDuckSpots.includes(x + 1) ||
        fishs.includes(x + 1) ||
        x + 1 > 24
      )
    ) {
      possibleDuckSpots.push(x + 1);
    }
    if (
      !(possibleDuckSpots.includes(x - 1) || fishs.includes(x - 1) || x - 1 < 0)
    ) {
      possibleDuckSpots.push(x - 1);
    }
    if (
      !(
        possibleDuckSpots.includes(x + 5) ||
        fishs.includes(x + 5) ||
        x + 5 > 24
      )
    ) {
      possibleDuckSpots.push(x + 5);
    }
    if (
      !(possibleDuckSpots.includes(x - 5) || fishs.includes(x - 5) || x - 5 < 0)
    ) {
      possibleDuckSpots.push(x - 5);
    }
  }
  const ducks = [];
  for (let i = 0; i < 3; i++) {
    let random = Math.floor(Math.random() * possibleDuckSpots.length);
    while (ducks.includes(possibleDuckSpots[random]))
      random = Math.floor(Math.random() * possibleDuckSpots.length);
    ducks.push(possibleDuckSpots[random]);
  }
  const arr = [];
  console.log(fishs, ducks);
  for (let i = 0; i < 5; i++) {
    arr.push([]);
    for (let j = 0; j < 5; j++) {
      if (ducks.includes(i * 5 + j)) arr[i][j] = { type: GridTypes.DUCK };
      else if (fishs.includes(i * 5 + j)) arr[i][j] = { type: GridTypes.FISH };
      else arr[i][j] = { type: GridTypes.NOTHING };
    }
  }
  return arr;
}

export function CreateGrid(data) {
  let result = "";
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      switch (data[i][j].type) {
        case GridTypes.NOTHING:
          result += ":black_large_square:";
          break;
        case GridTypes.DUCK:
          result += ":duck:";
          break;
        case GridTypes.FISH:
          result += ":black_large_square:";
          break;
      }
    }
    result += "\n";
  }
  return result;
}

export function CreateGridButtons(data) {
  const buttons = [
    { type: MessageComponentTypes.ACTION_ROW, components: [] },
    { type: MessageComponentTypes.ACTION_ROW, components: [] },
    { type: MessageComponentTypes.ACTION_ROW, components: [] },
    { type: MessageComponentTypes.ACTION_ROW, components: [] },
    { type: MessageComponentTypes.ACTION_ROW, components: [] },
  ];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let value;
      switch (data[i][j].type) {
        case GridTypes.DUCK:
          value = `duck*${i * 5 + j}`;
          break;
        case GridTypes.FISH:
          value = `fish*${i * 5 + j}`;
          break;
        case GridTypes.NOTHING:
          value = `nothing*${i * 5 + j}`;
          break;
      }
      buttons[i].components.push({
        type: MessageComponentTypes.BUTTON,
        label: "Button",
        custom_id: value,
        style: ButtonStyleTypes.SECONDARY,
      });
    }
  }
  console.log(buttons);
  for (let i = 0; i < 5; i++) console.log(buttons[i].components);

  return buttons;
}
