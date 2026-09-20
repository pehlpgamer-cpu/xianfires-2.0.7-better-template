# Template details
- **status:** INCOMPLETE 
- **framework:** XianFires 2.0.7 https://www.npmjs.com/package/xianfires



# Improvements
## Others
- added `./requests` folder that contains request validation.
- convert AuthController into Controller object.
- added `.gitignore`
- Organized:
  - `routes/index.js`
  - npm scripts (incomplete)

## Packages
### Replaced
- Japa > Jest https://japa.dev/docs/introduction
- argon2 > bcrypt
  - https://www.npmjs.com/package/argon2
  - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id

### Missing
- Security:
  - env: `DotEnv` https://www.npmjs.com/package/dotenv
  - validation: `Zod` https://zod.dev/
  - UUID: https://www.npmjs.com/package/uuid
- code quality:
  - Oxlint https://oxc.rs/docs/guide/what-is-oxc.html
  - Oxfmt https://oxc.rs/docs/guide/usage/formatter.html
  - dependency-cruiser https://www.npmjs.com/package/dependency-cruiser


