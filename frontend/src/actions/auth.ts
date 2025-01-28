"use server"

import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function signUp(formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  // Here you would typically save the user to your database
  // For this example, we'll just simulate a successful signup
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

