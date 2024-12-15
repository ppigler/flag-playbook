import PlaybookToolbar from "@/component/PlaybookToolbar/PlaybookToolbar";
import { Box, Grid2 as Grid } from "@mui/material";
import { ReactNode } from "react";

const PlayLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      container
      sx={{ height: "calc(100% - 60px)", width: "100%", overflowY: "hidden" }}
    >
      <Box>{children}</Box>
      <PlaybookToolbar />
    </Grid>
  );
};

export default PlayLayout;
