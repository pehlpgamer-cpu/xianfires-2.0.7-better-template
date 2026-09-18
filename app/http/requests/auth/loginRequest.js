import * as z from "zod";
/**
 * @param {object} req // Express.js
 * @returns {object} 
 */
export const loginRequest = (req) =>
{
    const data = {
        email: req.body.email,
        password: req.body.password,
    };

    const Login = z.object({
        email: z.string(),
        password: z.string(),
    });

    try {
        Login.parse(data)
        return data
    } 
    catch (error) {
        if (error instanceof z.ZodError) {
            return error.issues
        }
    }
}