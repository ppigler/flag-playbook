"use client";

import { usePlayStore } from "@/store/playStore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { TbTrash } from "react-icons/tb";
import Play from "../Play/Play";

const Playbook = () => {
  const plays = usePlayStore(useShallow((state) => state.plays));
  const deletePlay = usePlayStore.use.deletePlay();

  const playIds = useMemo(() => Object.keys(plays), [plays]);

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} style={{ width: "100%" }}>
      {playIds.map((id, idx) => {
        const playName = idx + 1;
        const playUrl = `plays/${id}`;
        const image = plays[id]?.image;

        return (
          <Grid key={idx} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardHeader title={playName} />
              <CardContent sx={{ justifyContent: "center", display: "flex" }}>
                {image ? (
                  <Image
                    width={150}
                    height={120}
                    src={image}
                    alt={`Play ${playName}`}
                  />
                ) : (
                  <Play playId={id} isViewOnly />
                )}
              </CardContent>
              <CardActions>
                <Link
                  passHref
                  href={playUrl}
                  aria-label={`open play ${playName}`}
                >
                  <Button>edit</Button>
                </Link>
                <IconButton
                  style={{ marginLeft: "auto" }}
                  onClick={() => deletePlay(id)}
                  aria-label={`delete ${playName}`}
                  size="small"
                >
                  <TbTrash />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Playbook;
