"use client";

import { ReactNode } from "react";
// import { useParams } from "next/navigation";

const PlayLayout = ({ children }: { children: ReactNode }) => {
  // const params = useParams();

  return (
    <section id="container">
      <main>{children}</main>
    </section>
  );
};

export default PlayLayout;
