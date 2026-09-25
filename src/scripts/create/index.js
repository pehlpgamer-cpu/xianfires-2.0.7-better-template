import { createController } from "./controller.js";
import { createModel } from "./model.js";
import { createRequest } from "./request.js";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
🚀 XianFire Model & Express Controller Generator

Usage:
  xian create:model <ModelName>
  xian create:controller <ControllerName>

Examples:
  xian create:model User
  xian create:controller userController

Note: Controller names are typically camelCase (e.g., userController, productController)
`);
  process.exit(0);
}

const type = args[0]; // 'model' or 'controller'
const name = args[1]; // e.g., 'User' or 'userController'

// Run based on type
(async () => {
  try {
    if (type === "model") {await createModel(name);}
    else if (type === "controller") {await createController(name);}
    else if (type === "request") {await createRequest(name)}
    else {
      console.error('❌ Unknown type. Use "model" or "controller".');
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
