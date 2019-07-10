import { keccak256 } from "ethereumjs-util";
import * as crypto from "crypto";

/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
export function bufSortJoin(...args: Buffer[]) {
  return Buffer.concat([...args].sort(Buffer.compare));
}

// If element is not a buffer, stringify it and then hash it to be a buffer
export function toBuffer(element: any) {
  return Buffer.isBuffer(element) && element.length === 32 ? element : keccak256(JSON.stringify(element));
}

// If hash is not a buffer, convert it to buffer (without hashing it)
export function hashToBuffer(hash: any) {
  return Buffer.isBuffer(hash) && hash.length === 32 ? hash : Buffer.from(hash, "hex");
}

/**
 * Turns array of data into sorted array of hashes
 */
export function hashArray(arr: any[]) {
  return arr.map(i => toBuffer(i)).sort(Buffer.compare);
}

export function randomSalt(saltLength = 10) {
  return crypto.randomBytes(saltLength).toString("hex");
}

export function sha256(content: string, salt = "") {
  const hash = crypto.createHash("sha256");
  hash.update(content + salt);

  return `sha256$${hash.digest("hex")}`;
}

/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
export function combineHashBuffers(first?: Buffer, second?: Buffer): Buffer {
  if (!second) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return first!; // it should always be valued if second is not
  }
  if (!first) {
    return second;
  }
  return keccak256(bufSortJoin(first, second));
}

/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param first A string to be hashed (without 0x)
 * @param second A string to be hashed (without 0x)
 * @returns Resulting string after the hash is combined (without 0x)
 */
export function combineHashString(first?: string, second?: string): string {
  return first && second
    ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString("hex")
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (first || second)!; // this should always return a value right ? :)
}
