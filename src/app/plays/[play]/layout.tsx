import PlaybookToolbar from "@/component/PlaybookToolbar/PlaybookToolbar";
import { Grid2 as Grid } from "@mui/material";
import { ReactNode } from "react";

const PlayLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      container
      sx={{
        "&::before": {
          content: "''",
          position: "absolute",
          display: "block",
          top: 0,
          left: -10,
          right: -10,
          borderLeft: "30px solid red",
          borderRight: "30px solid red",
          zIndex: 300,
        },
        height: "calc(100% - 60px)",
        width: "100%",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
      id="container"
    >
      {children}
      <PlaybookToolbar />
    </Grid>
  );
};

export default PlayLayout;
