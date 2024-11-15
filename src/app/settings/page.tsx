import DefaultColors from "@/component/SettingsPage/DefaultColors/DefaultColors";
import Formations from "@/component/SettingsPage/Formations/Formations";
import NumberOfPlayers from "@/component/SettingsPage/NumberOfPlayers/NumberOfPlayers";
import { Grid2 as Grid, Typography } from "@mui/material";

const SettingsPage = () => (
  <Grid container direction="column" spacing={4}>
    <Grid sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography sx={{ marginBottom: 2 }}>Number of players</Typography>
      <NumberOfPlayers />
    </Grid>
    <Grid>
      <Typography sx={{ marginBottom: 2 }}>Default colors</Typography>
      <DefaultColors />
    </Grid>
    <Grid>
      <Typography sx={{ marginBottom: 2 }}>Formations</Typography>
      <Formations />
    </Grid>
  </Grid>
);

export default SettingsPage;
