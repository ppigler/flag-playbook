"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { Position } from "@/types/play";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { TbChevronDown } from "react-icons/tb";

declare type FormationLabelsProps = {
  positions: Position[];
  id: string;
};

const FormationLabels = ({ positions, id }: FormationLabelsProps) => {
  const setFormationLabels = useSettingsStore.use.setFormationLabels();

  const [labels, setLabels] = useState<string[]>(positions.map(() => ""));

  const handleSetFormationLabels = () => setFormationLabels(id, labels);

  const handleChangeLabel = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) =>
    setLabels((labels) => [
      ...labels.slice(0, idx),
      event.target.value,
      ...labels.slice(idx + 1),
    ]);

  return (
    <Accordion>
      <AccordionSummary id={id} expandIcon={<TbChevronDown />}>
        <Typography>Labels</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid container direction="row">
            {labels.map((label, idx) => {
              const textFieldLabel =
                idx === 0
                  ? "Center"
                  : idx === 1
                  ? "Quarterback"
                  : "Skill player";
              return (
                <TextField
                  key={positions[idx].id}
                  value={label}
                  label={textFieldLabel}
                  placeholder={textFieldLabel}
                  onChange={(event) => handleChangeLabel(event, idx)}
                />
              );
            })}
          </Grid>
          <Grid container direction="row">
            <Button onClick={handleSetFormationLabels}>Save</Button>
            <Button>Cancel</Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default FormationLabels;
