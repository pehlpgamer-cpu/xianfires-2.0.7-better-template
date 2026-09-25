# New Scripts

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `npm run test`            | Run all types of tests (3 dep, unit, feature, browser)          |
| `npm run dep:svg`        | exports dependency graph in `./dependency-graph.svg` |
| `npm run dep:quick`  | quickly identify dependency/import issues                       |
| `npm run dep:report` | detailed dependency/import report in `./dependency-report.html` |
| `npm run dep:matrix` | `./dependency-matrix.html`                                      |
| `npm run migrate`         | (🚧WIP) database migration w/out resetting|
| `npm run migrate:fresh`   | (🚧WIP) Reset and migrate database|
| `npm run migrate:drop`    | (🚧WIP) Drop all tables|
| `npm run fmt`             | Format source code |
| `npm run fmt:check`       | Check formatting |
| `npm run lint`            | Run Oxlint |
| `npm run lint:fix`        | Fix lint issues |

# While developing, periodically run:

```bash
npm run fmt
npm run lint
npm run test:dep:quick
```

This helps keep the project formatted, lint-clean, tested, and architecturally consistent.
