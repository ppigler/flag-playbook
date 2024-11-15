import { Box, AppBar as AppBarMUI, Toolbar, Typography } from "@mui/material";
import PlaySelector from "./PlaySelector/PlaySelector";

const AppBar = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBarMUI position="static">
      <Toolbar>
        <Typography flexGrow={1} variant="h6">
          Create-a-playbook
        </Typography>
        <PlaySelector />
      </Toolbar>
    </AppBarMUI>
  </Box>
);

export default AppBar;
