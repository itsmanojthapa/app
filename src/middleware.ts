export { auth } from "@/app/auth";

import NextAuth from "next-auth";
import { auth } from "@/app/auth";
import { NextRequest } from "next/server";

export default auth(async function middleware(req: NextRequest) {
  console.log("------------------------------------------------" + req.url);
});

export const config = {
  matcher: ["/", "/post"],
};
