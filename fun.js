import readline from "readline";

/*
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
*/
let str =
  "Sam Tung Uk Village, also known as Sam Tung Uk Walled Village, is a Hakka walled village that was built by the Chan clan in the year 1786. The clan settled in Tsuen Wan in the mid-18th century, and they reclaimed land along the coast in order to cultivate. Sam Tung Uk was founded by Chan Yam-shing, a leader of the clan, who constructed three rows of village houses, which were later expanded by his descendants, who built annexes on both sides and at the back of the houses. The ancestral altar was placed in the main hall, which lay on the central axis and faced the main entrance. Four Chinese characters signifying ‘Chan Family Ancestral Hall’ are engraved on the granite lintel above the door frame. The village was restored in 1987 and opened to the public as the Sam Tung Uk Museum. It was declared a monument in 1981. Due to the construction of the Tsuen Wan MTR line in the first quarter of 1979, the original residences decided to relocate to another location, which is near Cheung Pei Shan. In the year 1987, the Regional Council of that time decided to rebrand? the original village and reopen to the public as Sam Tung Uk Museum, and is now managed by the Leisure and Cultural Services Department.";
let amt = 0;
for (let i = 0; i < str.length; i++) {
  if (str[i] == " ") amt++;
}
console.log(amt);
