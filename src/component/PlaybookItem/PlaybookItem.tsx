"use client";

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
import Play from "../Play/Play";
import Link from "next/link";
import { MdDragHandle } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import DeletePlayDialog from "../DeletePlayDialog/DeletePlayDialog";

type PlaybookItem = {
  playId: string;
  playName: string;
  href: string;
  image?: string;
  deletePlayHandler: () => void;
};

const PlaybookItem = ({
  playId,
  deletePlayHandler,
  playName,
  href,
  image,
}: PlaybookItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: playId,
      transition: {
        duration: 150, // milliseconds
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition]
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleDeletePlay = () => {
    deletePlayHandler();
    setIsDeleteOpen(false);
  };
  const handleOpenDeletePlayDialog = () => setIsDeleteOpen(true);
  const handleCloseDeletePlayDialog = () => setIsDeleteOpen(false);

  return (
    <>
      <DeletePlayDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDeletePlayDialog}
        onDeleteHandler={handleDeletePlay}
      />
      <Grid size={{ xs: 6, md: 3 }} ref={setNodeRef} sx={style}>
        <Card sx={{ position: "relative" }}>
          <CardHeader title={playName} />
          <CardContent
            sx={{
              justifyContent: "center",
              display: "flex",
              padding: 0,
            }}
          >
            {image ? (
              <Image
                width={150}
                height={120}
                src={image}
                alt={`Play ${playName}`}
              />
            ) : (
              <Play playId={playId} isViewOnly />
            )}

            <IconButton
              sx={{ position: "absolute", top: 16, cursor: "grab" }}
              {...attributes}
              {...listeners}
            >
              <MdDragHandle />
            </IconButton>
          </CardContent>
          <CardActions>
            <Link passHref href={href} aria-label={`open play ${playName}`}>
              <Button>Edit</Button>
            </Link>
            <IconButton
              onClick={handleOpenDeletePlayDialog}
              sx={{ marginLeft: "auto" }}
              size="small"
              aria-label={`delete ${playName}`}
            >
              <TbTrash />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};

export default PlaybookItem;
