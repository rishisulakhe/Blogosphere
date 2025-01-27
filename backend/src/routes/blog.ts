import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { createBlog,updateBlog } from "medium-common";
export const blogRouter=new  Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
    Variables:{
        userId:string
    }
    
}>();


blogRouter.use('/*',async (c,next)=>{
    const header=c.req.header('authorization') || '';
    const token=header.split(' ')[1];
    const response=await verify(token,c.env.JWT_SECRET);
    if(response){
      c.set('userId',String(response.id));
      await next();
    }
    else{
      c.status(403);
      return c.json({
        msg:"Not verified/login"
      })
    }
  })

  
blogRouter.post('/',async (c)=>{
    const body=await c.req.json();
    const {success}=createBlog.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg:"Inputs are not correct"
        })
    }
    const autherId=c.get('userId');
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const post=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:autherId
        }
    });

    return c.json({
        id: post.id
    })
})

blogRouter.get('/bulk',async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs=await prisma.post.findMany();
    return c.json({
        blogs
    })
})

blogRouter.put('/',async (c)=>{
    const body=await c.req.json();
    const {success}=updateBlog.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg:"Wrong inputs"
        })
    }
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const post=await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
        }
    });

    return c.json({
        id: post.id
    })
})

blogRouter.get('/:id',async (c)=>{
    const id=c.req.param('id');
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try
    {
    const post=await prisma.post.findFirst({
        where:{
            id
        }
    });

    return c.json({
        post
    })}
    catch(e){
        c.status(411);
        return c.json({
            msg:"Error while fetching blog post"
        })
    }
})


