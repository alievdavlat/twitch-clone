"use client";
import React from "react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import Container from "./_components/Container";
interface CreatorLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  };
}
const CreatorLayout = ({ children }: CreatorLayoutProps) => {

  

  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20">
        <Sidebar />
        <Container>
        {children}
        </Container>
      </div>
    </>
  );
};

export default CreatorLayout;
