import * as z from "zod";
/**
 * @param {object} req // Express.js
 * @returns {object} 
 */
export const registerRequest = (req) =>
{
    const data = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        password: req.body.password.trim(),
    };

    const Register = z.object({
        name: z.string().min(6).max(14),
        email: z.string().max(64),
        password: z.string().min(14).max(64),
    });

    try {
        Register.parse(data)
        return data
    } 
    catch (error) {
        if (error instanceof z.ZodError) return {error: error.issues}
    }
}