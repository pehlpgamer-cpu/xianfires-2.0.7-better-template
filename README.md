- **status:** ⚠️ INCOMPLETE
- **framework:** `XianFires 2.0.7` https://www.npmjs.com/package/xianfires

> An improved version of XainFire framework that follows best practices, provides better examples & includes modern packages to improve developer experience while still being very similar to the original.

# Docker (WIP...)




# Documentation

- [overview](./docs/overview.md)
- [scripts](./docs/scripts.md)
- AI Generated
  - [xian view engine refactor conversation](./docs/AI-generated/xian-view-engine-conversation.md)
  - [xian view engine - documentation](./docs/AI-generated/xian-template-engine-documentation.md)

> WIP...

<!-- - [routes](./docs/routes.md)
- [controller](./docs/controllers.md)
- [validation](./docs/validation.md)
- [model](./docs/models.md)
- [view](./docs/views.md)
- [tests](./docs/tests.md)
- [middleware](./docs/middelware.md)
- [miscellaneous](./docs/)  -->

# Packages

## Replaced

- [Japa](https://japa.dev/docs/introduction) > `Jest`
- [Argon2](https://www.npmjs.com/package/argon2) > `bcrypt`
  - [Password Storage - OWASP Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id)

## Missing

- Security:
  - environment variables: [DotEnv](https://www.npmjs.com/package/dotenv)
  - validation: [Zod](https://zod.dev/)
  - UUID: [uuid](https://www.npmjs.com/package/uuid)
- code quality:
  - `Oxlint` https://oxc.rs/docs/guide/what-is-oxc.html
  - style formatter: `Oxfmt` https://oxc.rs/docs/guide/usage/formatter.html
  - `dependency-cruiser` https://www.npmjs.com/package/dependency-cruiser

# Current Issues
- ⚠️ Sequelize ORM
  - migration scripts.
  - database seeder.
- no template creation script (need to do manual config).
- Electron implementation.
- Incomplete docs.
- Auth & Product logic.
- no ratelimit.
- `npm run create:` is incomplete & messy.
- `./tests` examples and unsure if it works w/out problem.

# AI generated

## AI slop

- `list-routes.js`
- `src/*` massive overhaul of xian view engine.

## Partial

- `sequelize` implementation because `sequelize-cli` is buggy, docs are in CommonJS style, so had I to make a workaround.

## Minimal

- none.
