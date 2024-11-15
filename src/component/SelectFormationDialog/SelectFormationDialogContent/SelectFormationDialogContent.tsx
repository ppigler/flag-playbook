"use client";

import { usePlayStore } from "@/store/playStore";
import {
  Button,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  Grid2 as Grid,
  Radio,
} from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

type SelectFormationDialogContentProps = {
  formations: Record<string, { name: string; image?: string }>;
  handleClose: () => void;
};

const SelectFormationDialogContent = ({
  formations,
  handleClose,
}: SelectFormationDialogContentProps) => {
  const createPlay = usePlayStore.use.createPlay();
  const [selectedFormation, setSelectedFormation] = useState<null | string>(
    null
  );

  const handleRadioOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSelectedFormation(event.target.value);
  const handleCreatePlay = () => {
    createPlay(selectedFormation!);
    handleClose();
  };

  return (
    <>
      <DialogContent dividers>
        <DialogContentText id="select-formation-dialog-desc">
          desc
        </DialogContentText>
        <Grid container spacing={4}>
          {Object.entries(formations).map(([id, { name, image }]) => (
            <Grid key={id} size={{ md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Grid container direction="column">
                    <Grid>
                      <FormControl>
                        <FormControlLabel
                          value={id}
                          control={
                            <Radio
                              checked={selectedFormation === id}
                              onChange={handleRadioOnChange}
                              value={id}
                              name="radio-buttons"
                              inputProps={{ "aria-label": id }}
                            />
                          }
                          label={name}
                        />
                      </FormControl>
                    </Grid>
                    <Grid sx={{ width: 150, height: 120 }}>
                      <Image src={image!} alt={name} height={120} width={150} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={selectedFormation === null}
          onClick={handleCreatePlay}
        >
          Create
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </>
  );
};

export default SelectFormationDialogContent;
