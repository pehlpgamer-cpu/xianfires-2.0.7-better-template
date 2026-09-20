
export const singleResourceRequest = (req) => 
{
    const data = {id: req.params.id}
    const resource = z.object({id: z.int()})
    try {
        resource.parse(data)
        return data
    } 
    catch (error) {
        if (error instanceof z.ZodError) return error.issues
    }
}