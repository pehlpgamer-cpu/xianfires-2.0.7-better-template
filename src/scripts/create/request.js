import path from "path";
import fs from "fs/promises";
import { ensureDir } from "../utils.js";

export const createRequest = async (requestName) => {
    const requestDir = path.join(process.cwd(), "app/http/requests");
    await ensureDir(requestDir);
    const controllerPath = path.join(requestDir, `${requestName}.js`);

    const controllerContent = `
        import * as z from "zod";
        /**
         * @param {object} req // Express.js
         * @returns {object}
         */
        export const ${requestName} = (req) => {
        const data = {
            id: req.params.id,
            //...
        };

        const Schema = z.object({
            id: z.int()
            //...
        });

        try {
            Schema.parse(data);
            return data;
        } catch (error) {
            if (error instanceof z.ZodError) {
            return error.issues;
            }
        }
        };
    `.trim();

    await fs.writeFile(controllerPath, controllerContent);
    console.log(`✅ Express Controller created: ${controllerPath}`);
};
