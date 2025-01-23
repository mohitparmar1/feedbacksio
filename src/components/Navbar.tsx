"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="p-2 md:p-3 shadow-md mt-3 bg-black-primary rounded-md text-white mx-10">
      <div className="container mx-auto flex flex-row md:flex-row justify-between items-center">
        <a href="/" className="text-sm md:text-lg font-bold mb-4 md:mb-0">
          Seekfeedback
        </a>
        {session ? (
          <>
            <span className="mr-4 text-sm items-center">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className=" md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
