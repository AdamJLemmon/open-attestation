import VerEx from "verbal-expressions";

const hexDigits = VerEx().range("0", "9", "a", "f", "A", "F");

const hexString = VerEx()
  .then("0x")
  .then(hexDigits)
  .oneOrMore();

export const isHexString = inputString => {
  const testRegex = VerEx()
    .startOfLine()
    .then(hexString)
    .endOfLine();

  return testRegex.test(inputString);
};
