"use client";

import { IconButton, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const PlaySelector = () => {
  const params = useParams();
  const router = useRouter();
  const [plays, setPlays] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const storedPlays = JSON.parse(localStorage?.getItem("plays") ?? "[]");
    setPlays(storedPlays);
  }, [params.play]);

  const playIndex = params.play
    ? plays.findIndex((play) => play.name === params.play.toString())
    : -1;
  const selectedPlayLabel = params.play ? playIndex + 1 : null;
  const isPreviousPlay = playIndex > 0;
  const isNextPlay = plays.length > playIndex + 1;

  return (
    selectedPlayLabel && (
      <>
        <IconButton
          aria-label="previous play"
          disabled={!isPreviousPlay}
          onClick={() => router.push(`/plays/${plays[playIndex - 1].name}`)}
        >
          <TbChevronLeft />
        </IconButton>
        <Typography>{selectedPlayLabel}</Typography>
        <IconButton
          aria-label="next play"
          disabled={!isNextPlay}
          onClick={() => router.push(`/plays/${plays[playIndex + 1].name}`)}
        >
          <TbChevronRight />
        </IconButton>
      </>
    )
  );
};

export default PlaySelector;
