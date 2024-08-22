"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession, SessionProvider } from "next-auth/react";

export default function Check() {
  const [userData, setUserData] = useState<
    { name: string; email: string; password: string; id: string }[]
  >([]);
  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => setUserData(data.users))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const { data: session, status } = useSession();
  return (
    <SessionProvider>
      <div className="flex flex-col justify-center items-center mt-5">
        <h1 className="text-4xl font-bold">
          Welcome <span className="text-red-500">{session?.user?.name}</span>
        </h1>
        <Table>
          <TableCaption>A list of your Users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Password</TableHead>
              <TableHead className="text-left">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData &&
              userData.map((user, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell className="font-medium">{user?.name}</TableCell>
                    <TableCell>{user?.password}</TableCell>
                    <TableCell className="text-left">{user?.id}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </SessionProvider>
  );
}
