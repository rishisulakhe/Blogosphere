import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();


app.post('/api/v1/signup', async (c) => {
  console.log('Database URL:', c.env.DATABASE_URL);
  console.log('JWT Secret:', c.env.JWT_SECRET);

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  
    const body = await c.req.json();
    if (!body.email || !body.password) {
      c.status(400);
      return c.json({ error: "Email and password are required" });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  
});





app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})


app.post('/api/v1/blog',(c)=>{
  return c.text("Upload Blog")
})

app.put('api/v1/blog',(c)=>{
  return c.text("")
})

app.get('/api/v1/blog/:id',(c)=>{
  const id=c.req.param('id');
  console.log(id);
  return c.text("Get blog")
})


app.get('/', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  return c.text('Hello Hono!')
})
app.get('/api/v1/blog/bulk',(c)=>{
  return c.text("Get all blogs")
})
export default app
