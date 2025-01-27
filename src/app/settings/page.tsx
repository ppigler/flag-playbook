import DefaultColors from "@/component/SettingsPage/DefaultColors/DefaultColors";
import Formations from "@/component/SettingsPage/Formations/Formations";
import Indicator from "@/component/SettingsPage/Indicator/Indicator";
import NumberOfPlayers from "@/component/SettingsPage/NumberOfPlayers/NumberOfPlayers";
import { Grid2 as Grid, Typography } from "@mui/material";

const SettingsPage = () => (
  <Grid container direction="column" spacing={4}>
    <Grid sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Indicator id="numberOfPlayers">
        <Typography sx={{ marginBottom: 2 }}>Number of players</Typography>
      </Indicator>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Set the number of players per side for this playbook. Set 5 for 5v5 i.e.
      </Typography>
      <NumberOfPlayers />
    </Grid>
    <Grid>
      <Typography sx={{ marginBottom: 2 }}>Default colors</Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Set the color for each position.
      </Typography>
      <DefaultColors />
    </Grid>
    <Grid>
      <Indicator id="formations">
        <Typography sx={{ marginBottom: 2 }}>Formations</Typography>
      </Indicator>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Set default formations for your playbook. When creating plays, you start
        it by selecting one from your default position you define here.
        Remember, you can later fine-tune positions per plays by dragging the
        players, which doesn&apos;t impact the default position.
      </Typography>
      <Formations />
    </Grid>
  </Grid>
);

export default SettingsPage;
