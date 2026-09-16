import * as argon2 from "argon2";
export const argon2Config = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    hashLength: 50,
    parallelism: 1,
} 