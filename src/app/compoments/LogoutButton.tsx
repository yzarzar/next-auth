"use client";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";

export default function LogoutButton() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      if (session?.token) {
        await axios.post(
          "https://user-api-staging.aceplusbeta.com/api/auth/logout",
          null,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    await signOut({ redirect: true, callbackUrl: "/login" });
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 ${
        isLoading
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      } text-white rounded `}
    >
      {isLoading ? "Logging out ..." : "Logout"}
    </button>
  );
}
