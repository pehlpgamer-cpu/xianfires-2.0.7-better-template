import { test } from '@japa/runner'
test('get /products', async ({ client }) => 
{
  const response = await client.get('/products')

  console.log(response.body())
  console.log(response.status())
})
