import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function findGroupString(string, query, bool) {
  string = string.split(/[.,!?;:\s-]/).filter(Boolean);
  console.log(string);
  query = query.split(/[.,!?;:\s-]/).filter(Boolean);

  console.log(query);
  let j = 0;
  for (let i = 0; i < string.length; i++) {
    if (
      (bool === "yes" ? string[i] : string[i].toLowerCase()) ==
      (bool === "yes" ? query[j] : query[j].toLowerCase())
    )
      j++;
    else j = 0;
    if (j == query.length) return "found";
  }
  return "not found";
}

rl.question("Enter Your Text: ", (input1) => {
  rl.question("Enter Your Query: ", (input2) => {
    rl.question("Do you want it to be case-sensitive?(yes/no)", (input3) => {
      console.log(findGroupString(input1, input2, input3));
      rl.close();
    });
  });
});
