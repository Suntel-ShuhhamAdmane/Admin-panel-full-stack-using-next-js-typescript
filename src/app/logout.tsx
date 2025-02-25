"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    toast.success("Logging out...");
    
    await signOut({ redirect: false }); // Ensure session is cleared
    
    // Force a full page reload to clear session data in memory
    router.replace("/");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-200 text-black px-4 py-2 mr-5 text-end rounded hover:bg-red-400 transition duration-200"
    >
      Logout
    </button>
  );
};

export default Logout;
