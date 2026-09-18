

export const argon2Config = {
    type: process.env.ARGON2_TYPE || 2,
    memoryCost: process.env.ARGON2_MEMORY_COST || 2 ** 16,
    hashLength: process.env.ARGON2_HASH_LENGTH || 50,
    parallelism: process.env.ARGON2_PARALLELISM || 1,
} 