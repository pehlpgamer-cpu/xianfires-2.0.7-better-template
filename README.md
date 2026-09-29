- **status:** ⚠️ INCOMPLETE
- **framework:** `XianFires 2.0.7` https://www.npmjs.com/package/xianfires

> An improved version of XainFire framework that follows best practices, provides better examples & includes modern packages to improve developer experience while still being very similar to the original.

# Docker (WIP...)
## DEV
```bash
# Check Compose configuration
docker compose -f compose.dev.yaml config

# Start
docker compose -f compose.dev.yaml up -d

# Verify containers
docker compose -f compose.dev.yaml ps
```

### Inside the Dev Container
```bash
# Start the development server
npm run dev
```

### Useful DEV commands
```bash
# View logs
docker compose -f compose.dev.yaml logs -f

# Rebuild and start
docker compose -f compose.dev.yaml up -d --build

# Stop
docker compose -f compose.dev.yaml down
```

## PROD (⚠️WIP & untested)

```powershell
# Create the real production environment file
Copy-Item .env.production.example .env.production

# Verify it exists
Test-Path .env.production
```

### Check configuration
```bash
# Check the resolved Compose configuration
docker compose --env-file .env.production -f compose.prod.yaml config

# Check Compose interpolation environment
docker compose --env-file .env.production -f compose.prod.yaml config --environment
Start
docker compose --env-file .env.production -f compose.prod.yaml up -d --build
Verify
docker compose --env-file .env.production -f compose.prod.yaml ps
Logs
docker compose --env-file .env.production -f compose.prod.yaml logs -f
```

### Useful PROD commands
```bash
# Rebuild and restart
docker compose --env-file .env.production -f compose.prod.yaml up -d --build

# Stop
docker compose --env-file .env.production -f compose.prod.yaml down

# Check configuration again
docker compose --env-file .env.production -f compose.prod.yaml config
```

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
