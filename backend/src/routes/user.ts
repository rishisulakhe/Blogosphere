import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import {signinInput } from '1medium-common'
import {signupInput} from '1medium-common'
export const userRouter=new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

userRouter.post('/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  
    const body = await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        msg:"Inputs not correct"
      })
    }
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


userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        msg:"Inputs not corect"
      })
    }
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
