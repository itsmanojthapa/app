export { auth } from "@/app/auth";

import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth(async function middleware(req) {});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
