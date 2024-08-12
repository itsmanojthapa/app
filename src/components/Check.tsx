"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Check() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFromData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData?.name,
          email: formData?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      setUserData([...userData, data.user]);
      setTimeout(() => {}, 5 * 1000);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const [userData, setUserData] = useState<{ name: string; email: string }[]>(
    []
  );

  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => setUserData(data.users))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  function formChange() {
    setFromData({
      //@ts-ignore
      name: document.querySelector("#name")?.value as string,
      //@ts-ignore
      email: document.querySelector("#email")?.value as string,
    });
    console.log(formData);
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <form onChange={formChange} className="flex flex-col">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" className="border-2" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" className="border-2" id="email" name="email" />
        </div>
      </form>
      <Button
        className="font-extrabold text-yellow-500"
        onClick={handleClick}
        disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData &&
        userData.map((user, i) => {
          return (
            <div key={i} className="flex space-x-6 mt-5">
              <div>{user?.name}</div>
              <div>{user?.email}</div>
            </div>
          );
        })}
    </div>
  );
}
