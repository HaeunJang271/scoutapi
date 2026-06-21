export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/api/reddit/:path*", "/api/analysis/:path*"],
};
