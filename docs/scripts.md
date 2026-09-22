# New Scripts

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `npm run test`            | Run all types of tests (3 dep, unit, feature, browser)          |
| `npm run test:dep`        | runs all 3 dependency/import test                               |
| `npm run test:dep:quick`  | quickly identify dependency/import issues                       |
| `npm run test:dep:report` | detailed dependency/import report in `./dependency-report.html` |
| `npm run test:dep:matrix` | `./dependency-matrix.html`                                      |
| `npm run migrate`         | database migration w/out resetting                              |
| `npm run migrate:fresh`   | Reset and migrate database                                      |
| `npm run migrate:drop`    | Drop all tables                                                 |
| `npm run fmt`             | Format source code                                              |
| `npm run fmt:check`       | Check formatting                                                |
| `npm run lint`            | Run Oxlint                                                      |
| `npm run lint:fix`        | Fix lint issues                                                 |

# While developing, periodically run:

```bash
npm run fmt
npm run lint
npm run test:dep:quick
```

This helps keep the project formatted, lint-clean, tested, and architecturally consistent.
