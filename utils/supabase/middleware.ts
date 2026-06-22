import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — IMPORTANT: do not add any logic between here and the
  // end of this function that could alter which response is returned.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /Dashboard routes (except /Dashboard/login)
  const path = request.nextUrl.pathname;
  const isDashboard =
    path.startsWith("/Dashboard") || path.startsWith("/dashboard");
  const isLoginPage =
    path.startsWith("/Dashboard/login") ||
    path.startsWith("/dashboard/login");

  if (isDashboard && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/Dashboard/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
};
