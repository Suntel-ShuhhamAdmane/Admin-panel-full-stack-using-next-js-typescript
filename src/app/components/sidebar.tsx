"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { FaReact } from "react-icons/fa";

const Sidebar = () => {
  const router = useRouter();
  const adminId = 2; 
  const [profileImage, setProfileImage] = useState("");

  // Fetch admin photo
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`/admin/photo/${adminId}`);
        const data = await res.json();
        if (res.ok && data.photo) {
          setProfileImage(`data:image/jpeg;base64,${data.photo}`);
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };
    fetchPhoto();
  }, [adminId]); 

  // Handle file upload and update photo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`/admin/photo/${adminId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfileImage(`data:image/jpeg;base64,${data.photo}`); // Immediately update image
        console.log("Photo updated successfully!");
      } else {
        console.error("Failed to update photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="w-64 h-screen fixed text-black shadow-2xl p-5">
      <div className="flex flex-col items-center mb-5">
        <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 shadow-lg border-4 border-gray-600">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
          <label htmlFor="profileImageInput" className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-xs text-black">Change</span>
          </label>
        </div>
        <input id="profileImageInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      <h2 className="text-2xl text-black font-serif mb-10 text-center">Dashboard</h2>
      <ul className="space-y-4 text-black">
        <li className="flex items-center gap-3 cursor-pointer hover:text-gray-400 transition-colors" onClick={() => router.push("/dashboard/home")}>
          <HomeIcon className="w-5 h-5 text-black" />
          <span className="text-lg font-medium font-serif">Home</span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-gray-400 transition-colors" onClick={() => router.push("/dashboard")}>
          <UserIcon className="w-5 h-5 text-black" />
          <span className="text-lg font-medium font-serif">Users</span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-gray-400 transition-colors" onClick={() => router.push("/dashboard/projects")}>
          <FaReact className="w-5 h-5 text-black" />
          <span className="text-lg font-medium font-serif">Projects</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
