import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=service_unavailable", req.url));
  }

  const url = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (token_hash && type) {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "magiclink",
    });

    if (error) {
      console.error("Error verifying magic link:", error);
      return NextResponse.redirect(new URL("/login?error=invalid_magic_link", req.url));
    }

    if (session) {
      // Redirect to home page with success
      return NextResponse.redirect(new URL("/?magic_link_success=true", req.url));
    }
  }

  // If no token or error, redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}
