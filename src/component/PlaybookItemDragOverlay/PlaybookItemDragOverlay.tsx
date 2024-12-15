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
import { MdDragHandle } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import { useShallow } from "zustand/shallow";

const PlaybookItemDragOverlay = ({ id }: { id: string }) => {
  const plays = usePlayStore(useShallow((state) => state.plays));
  const image = plays[id].image!;
  const playName = plays[id].order + 1;

  return (
    <Grid>
      <Card>
        <CardHeader title={playName} />
        <CardContent
          sx={{
            justifyContent: "center",
            display: "flex",
            padding: 0,
          }}
        >
          <Image width={150} height={120} src={image} alt="play" />

          <IconButton
            sx={{ position: "absolute", top: 16, cursor: "grabbing" }}
          >
            <MdDragHandle />
          </IconButton>
        </CardContent>
        <CardActions>
          <Button>Edit</Button>
          <IconButton sx={{ marginLeft: "auto" }} size="small">
            <TbTrash />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PlaybookItemDragOverlay;
