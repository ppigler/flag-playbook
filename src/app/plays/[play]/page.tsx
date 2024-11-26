"use client";

import { usePlayStore } from "@/store/playStore";
import { IconButton, Snackbar } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const Play = dynamic(() => import("@/component/Play/Play"), {
  ssr: false,
});

const PlayPage = ({ params }: { params: { play: string } }) => {
  const { play } = params;
  const plays = usePlayStore.use.plays();
  const currentPlay = plays[play]?.order;

  const [isAlertOpen, setIsAlertOpen] = useState(true);
  const handleCloseAlert = () => setIsAlertOpen(false);

  return (
    <>
      {currentPlay !== undefined ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isAlertOpen}
          onClose={handleCloseAlert}
          autoHideDuration={6000}
          message={`Play ${currentPlay}`}
          action={
            <IconButton onClick={handleCloseAlert}>
              <MdClose fill="white" />
            </IconButton>
          }
        />
      ) : null}
      <Play playId={play} />
    </>
  );
};

export default PlayPage;
