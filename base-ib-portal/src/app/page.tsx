import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

// Landing route: send each role to its home.
export default async function Home() {
  const { profile } = await requireUser();
  redirect(profile.role === "admin" ? "/admin" : "/dashboard");
}
