import { auth } from "@/lib/auth"

export default async function proxy(request: Request) {
  const session = await auth()
  const url = new URL(request.url)
  const path = url.pathname

  if (path === "/" || path === "/login" || path === "/register" || path.startsWith("/api/auth")) return
  if (!session?.user) return Response.redirect(new URL("/login", request.url))
}
