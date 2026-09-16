# Improvements

## Others

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

- lucide icons https://lucide.dev/guide/lucide/
- Security:
  - env: `DotEnv` https://www.npmjs.com/package/dotenv
  - validation: `Zod` https://zod.dev/
- code quality:
  - Oxlint https://oxc.rs/docs/guide/what-is-oxc.html
  - Oxfmt https://oxc.rs/docs/guide/usage/formatter.html
  - dependency-cruiser https://www.npmjs.com/package/dependency-cruiser

# Todo list
- further improve scripts code quality.
  - remove `./scripts/create/index.js` ?
  - `route-cache.js`
  - `list-routes.js`
- fix & add command flags to `create:controller`
- route builder utils (prefix, parent controller & etc).
