import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import LogoutButton from "./compoments/LogoutButton";
import { authOptions } from "@/config/AuthOptions";

export default async function Home() {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome Home!</h1>
        <LogoutButton />
      </div>
      <p className="mt-4">You are logged in as: {session.user?.email}</p>
    </div>
  );
}
