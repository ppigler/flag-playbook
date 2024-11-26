"use client";

import * as React from "react";
import PlaybookToolbar from "@/component/PlaybookToolbar/PlaybookToolbar";
import dynamic from "next/dynamic";

const Play = dynamic(() => import("@/component/Play/Play"), {
  ssr: false,
});

const PlayPage = ({ params }: { params: { play: string } }) => {
  const { play } = params;

  return (
    <>
      <PlaybookToolbar />
      <Play playId={play} />
    </>
  );
};

export default PlayPage;
