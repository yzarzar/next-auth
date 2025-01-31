"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import API from "@/api/auth/api";

export default function LogoutButton() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      if (session?.token) {
        await API.logout();
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
