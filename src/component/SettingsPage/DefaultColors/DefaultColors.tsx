"use client";

import { useSettingsStore } from "@/store/settingsStore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useMemo, useState } from "react";
import _ from "lodash";
import { usePlayStore } from "@/store/playStore";

const DefaultColors = () => {
  const colors = useSettingsStore.use.colors();
  const numberOfPlayers = useSettingsStore.use.numberOfPlayers();
  const isNumberOfPlayersSet = useSettingsStore.use.isNumberOfPlayersSet();
  const setColors = useSettingsStore.use.setColors();
  const resetImages = usePlayStore.use.resetImages();

  const [colorValues, setColorValues] = useState(colors);

  const isSetColorsDisabled = useMemo(
    () => !isNumberOfPlayersSet || _.isEqual(colorValues, colors),
    [isNumberOfPlayersSet, colorValues, colors]
  );

  const setColorsHandler = () => {
    setColors(colorValues.slice(0, numberOfPlayers));
    resetImages();
  };
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {(!isNumberOfPlayersSet ? [] : colorValues).map((color, idx) => (
            <Grid key={idx} size={{ xs: 6, md: 3 }}>
              <MuiColorInput
                isAlphaHidden
                label={
                  idx === 0
                    ? "Center"
                    : idx === 1
                    ? "Quarterback"
                    : "Skill player"
                }
                format="hex"
                value={color}
                onChange={(newValue) =>
                  setColorValues((state) => [
                    ...state.slice(0, idx),
                    newValue,
                    ...state.slice(idx + 1),
                  ])
                }
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <CardActions>
        <Button disabled={isSetColorsDisabled} onClick={setColorsHandler}>
          Set
        </Button>
      </CardActions>
    </Card>
  );
};

export default DefaultColors;
