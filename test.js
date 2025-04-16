const components = {
  a: {
    execute: "a",
    sub_components: {
      d: "d",
    },
  },
  b: {
    execute: "b",
    sub_components: {
      e: "e",
    },
  },
  c: {
    execute: "c",
    sub_components: {
      f: "f",
    },
  },
};

const target = "d";
const feature = "a";
let segments = [feature];
let path = components;
while (segments[segments.length - 1] != target) {
  console.log(path);

  for (let i = 0; i < segments.length; i++) {
    path = path[segments[i]]?.sub_components;
  }
  //if (!path[segments[i]].sub_components) return console.log("error");
  for (const key in path) {
    //  console.log(path[key]);
  }
  // segments.push();
  segments[segments.length - 1] = target;
}

//[segments[0]].sub_components
