import { usePlaybookStore } from "@/store/playbookStore";
import {
  Box,
  debounce,
  Grid2 as Grid,
  IconButton,
  Paper,
  Slider,
  SwipeableDrawer,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { MdDragHandle } from "react-icons/md";
import { TbBackspace } from "react-icons/tb";

type RouteOptionsProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const RouteOptions = ({ isOpen, onClose, onOpen }: RouteOptionsProps) => {
  const handleSetMotion = usePlaybookStore.use.handleSetMotion();
  const handleToggleIsKey = usePlaybookStore.use.handleToggleIsKey();
  const toggleRounded = usePlaybookStore.use.toggleRounded();
  const handleRemoveRoute = usePlaybookStore.use.handleRemoveRoute();
  const handleChangeLabel = usePlaybookStore.use.handleChangeLabel();
  const routes = usePlaybookStore.use.routes();
  const positions = usePlaybookStore.use.positions();
  const selectedPosition = usePlaybookStore.use.selectedPosition();

  const currentRouteIdx = useMemo(
    () => selectedPosition?.index ?? 0,
    [selectedPosition]
  );

  const routeLength = useMemo(
    () => routes[currentRouteIdx].route.length,
    [routes, currentRouteIdx]
  );
  const motionValue = useMemo(
    () => routes[currentRouteIdx].motion,
    [routes, currentRouteIdx]
  );
  const isKey = useMemo(
    () => positions[currentRouteIdx].isKey ?? false,
    [positions, currentRouteIdx]
  );
  const isRoundedRoute = useMemo(
    () => positions[currentRouteIdx].isRoundedRoute ?? false,
    [positions, currentRouteIdx]
  );

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selectedPosition && positions[currentRouteIdx]) {
      setLabel(positions[currentRouteIdx].label ?? "");
    }
  }, [currentRouteIdx, selectedPosition, positions, setLabel]);

  const debouncedChangeHandler = debounce((newValue) => {
    handleChangeLabel(newValue);
  }, 500);

  const [selectedRouteSegment, setSelectedRouteSegment] = useState<
    null | number
  >(null);

  const handleChange = (value: string) => {
    setLabel(value);
    debouncedChangeHandler(value);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Grid
        container
        direction="column"
        sx={{ paddingBlockStart: 2, paddingBlockEnd: 4, paddingInline: 4 }}
      >
        <Grid container justifyContent="center">
          <Box>
            <MdDragHandle />
          </Box>
        </Grid>
        <Grid container direction="column">
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Label</Typography>
            <Paper>
              <TextField
                label="label"
                placeholder="Player label"
                value={label}
                onChange={(event) => handleChange(event.target.value)}
              />
            </Paper>
          </Grid>
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Option route</Typography>
            <Paper></Paper>
          </Grid>
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Motion</Typography>
            <Paper sx={{ paddingInline: 2 }}>
              <Slider
                value={motionValue}
                onChange={(_, value) => handleSetMotion(value as number)}
                min={0}
                max={routeLength}
                step={1}
                valueLabelDisplay="auto"
              />
            </Paper>
          </Grid>
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Mark as key player</Typography>
            <Paper>
              <Switch
                checked={isKey}
                onChange={(_, checked) => handleToggleIsKey(checked)}
              />
            </Paper>
          </Grid>
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Bend route</Typography>
            <Paper>
              <Switch
                checked={isRoundedRoute}
                onChange={(_, checked) => toggleRounded(checked)}
              />
            </Paper>
          </Grid>
          <Grid>
            <Typography sx={{ marginBottom: 2 }}>Remove route</Typography>
            <Paper>
              <Grid container direction="column">
                <Typography sx={{ marginBottom: 2 }}>Route</Typography>
                <ToggleButtonGroup
                  value={
                    selectedRouteSegment !== null ? [selectedRouteSegment] : []
                  }
                  onChange={(_, value) => {
                    if (value.length === 0) {
                      return setSelectedRouteSegment(null);
                    }
                    const route = value.at(-1);
                    setSelectedRouteSegment(route);
                  }}
                >
                  {routes[currentRouteIdx].route.map((route, index) => (
                    <ToggleButton key={`${route.x}-${route.y}`} value={index}>
                      {index + 1}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Grid container direction="row">
                  <Grid>
                    <IconButton onClick={() => handleRemoveRoute()}>
                      <TbBackspace />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

export default RouteOptions;
