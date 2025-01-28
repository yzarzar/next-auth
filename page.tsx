import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";

export default async function Home() {
  const session = (await getServerSession(auth)) as Session;

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
      {session.error === "RefreshAccessTokenError" && (
        <p className="mt-4">Access Token Expired</p>
      )}
    </div>
  );
}
