import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter Your Text: ", (input1) => {
  rl.question("Enter Your Query: ", (input2) => {
    rl.question("Do you want it to be case-sensitive?(yes/no)", (input3) => {
      console.log(findGroupString(input1, input2, input3));
      rl.close();
    });
  });
});
