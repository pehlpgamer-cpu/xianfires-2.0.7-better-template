import hbs from "hbs";

import { registerPartials } from "./partials.js";

/**
 * Creates an isolated Xian view engine.
 *
 * @param {object} options
 * @param {string} options.partialsDirectory
 * @returns {Promise<object>}
 */
export async function createXianEngine({
    partialsDirectory,
}) {
    // Create a completely separate hbs/Handlebars instance.
    const xian = hbs.create();

    // Recursively discover and register `.xian` partials.
    await registerPartials(
        xian,
        partialsDirectory,
    );

    return xian;
}