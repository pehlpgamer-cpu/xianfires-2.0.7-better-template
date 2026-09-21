- **status:** ⚠️ INCOMPLETE 
- **framework:** `XianFires 2.0.7` https://www.npmjs.com/package/xianfires

An improved version of XainFire framework that follows best practices, provides better examples & includes modern packages to improve developer experience while still being very similar to the original.  


# Quick Start

1. Open `terminal` or `powershell` app.
2. verify if NodeJS is installed 
```powershell
node -v; # must print "v24.21.0" or any version in terminal
```
3. if node is not installed
[download node LTS v24.21.0](https://nodejs.org/dist/v24.21.0/node-v24.21.0-x64.msi)

4. copy n paste command, change name if needed & enter.
```powershell
$projectName = "my-xianfire-enhanced-app";
```
5. copy, paste & enter command.
   - cd to Desktop.
   - make & cd to project folder.
   - git clone template.
   - executes `npm i`.
   - creates git repo & commit.
   - opens project in vscode. 

```powershell
cd "$env:USERPROFILE\Desktop"; mkdir $projectName; cd $projectName; git clone https://github.com/pehlpgamer-cpu/xianfires-2.0.7-better-template .; Write-Host "`ngit clone ✅completed" -ForegroundColor Green; [Console]::Beep(2000, 200); [Console]::Beep(2000, 200); npm i; Write-Host "`nnpm i ✅completed`n" -ForegroundColor Green; [Console]::Beep(2000, 200); [Console]::Beep(2000, 200); Remove-Item -Recurse -Force .git; git init; git add .; git commit -m "1st"; code .; exit; 
```

## VScode setup
1. Open VS Code
2. Press Ctrl + , (Windows/Linux) or Cmd + , (Mac) to open Settings
3. Click the "Open Settings (JSON)" icon in the top right (looks like a file with curly braces {})
4. Add or merge this snippet into your settings.json:
```json
{
  "files.associations": {
    "*.xian": "html"
  }
}
```
5. Vsocde extentions (semi-optional)
  - error lens
  - dotenv
  - oxc (oxlint & oxfmt)
  - material icon theme
  - path intellisense
  - html hint
  - highlight matching tag
  - indent rainbow
  - spell checker
  - auto close tag
  - fallow
  - better comments
```powershell
$extensions = @("usernamehw.errorlens", "mikestead.dotenv", "oxc.oxc-vscode", "stivo.tailwind-fold", "bradlc.vscode-tailwindcss", "pkief.material-icon-theme", "christian-kohler.path-intellisense", "htmlhint.vscode-htmlhint", "vincaslt.highlight-matching-tag", "oderwat.indent-rainbow", "streetsidesoftware.code-spell-checker", "formulahendry.auto-close-tag", "fallow-rs.fallow-vscode", "aaron-bond.better-comments"); $installed = code --list-extensions; $extensions | Where-Object { $_ -notin $installed } | ForEach-Object { code --install-extension $_; [Console]::Beep(2000, 200); [Console]::Beep(2000, 200)}
```


# Documentation
- [overview](./docs/overview.md)
- [scripts](./docs/scripts.md)
- [routes](./docs/routes.md) 🚧WIP🚧
- [controller](./docs/controllers.md) 🚧WIP🚧
- [validation](./docs/validation.md) 🚧WIP🚧
- [model](./docs/models.md) 🚧WIP🚧
- [view](./docs/views.md) 🚧WIP🚧
- [tests](./docs/tests.md) 🚧WIP🚧
- [middleware](./docs/middelware.md) 🚧WIP🚧
- [miscellaneous](./docs/) 🚧WIP🚧


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
- no template creation script (need to do manual config).
- Electron implementation.
- Incomplete docs.
- Auth & Product logic.
- Partials can't work with nested files.
- `./index.js` is still messy.
- database seeder.
- no ratelimit.
- `npm run create:` is incomplete & messy.
- `./tests` examples and unsure if it works w/out problem.

# AI generated 
## AI slop
- `list-routes.js` 

## Partial
- `sequelize` implementation because `sequelize-cli` is buggy, docs are in CommonJS style, so had I to make a workaround.

## Minimal
- none.