import { auth } from "@/lib/auth"

export default async function proxy(request: Request) {
  const session = await auth()
  const url = new URL(request.url)
  
  if (url.pathname.startsWith("/dashboard") && !session?.user) {
    return Response.redirect(new URL("/login", request.url))
  }
}