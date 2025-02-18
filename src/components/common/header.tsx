"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const Header = () => {
  return <Button onClick={() => signOut()}>logour</Button>;
};

export default Header;
