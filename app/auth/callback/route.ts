import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

// This route handles password reset callback with token_hash in query params
export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=service_unavailable", req.url));
  }

  const url = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  console.log("Password reset callback - token_hash:", token_hash, "type:", type);

  if (token_hash && type === "recovery") {
    // This is a password reset, redirect to reset password page
    return NextResponse.redirect(new URL(`/reset-password?token_hash=${token_hash}&type=${type}`, req.url));
  }

  // If no token or wrong type, redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}
