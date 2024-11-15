"use client";

import { PLAYER_NUMBER_OPTIONS } from "@/constants/positions";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import { useState } from "react";

const NumberOfPlayers = () => {
  const numberOfPlayers = useSettingsStore.use.numberOfPlayers();
  const isNumberOfPlayersSet = useSettingsStore.use.isNumberOfPlayersSet();

  const setNumberOfPlayers = useSettingsStore.use.setNumberOfPlayers();

  const [players, setPlayers] = useState(numberOfPlayers);
  const isSetDisabled = isNumberOfPlayersSet && numberOfPlayers === players;

  return (
    <Card>
      <CardContent>
        <FormControl sx={{ width: 300 }}>
          <InputLabel>Players</InputLabel>
          <NativeSelect
            value={players}
            onChange={(event) => setPlayers(parseInt(event.target.value))}
          >
            {PLAYER_NUMBER_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button
          disabled={isSetDisabled}
          onClick={() => setNumberOfPlayers(players)}
        >
          Set
        </Button>
      </CardActions>
    </Card>
  );
};

export default NumberOfPlayers;
