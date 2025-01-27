"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { Badge, Tooltip } from "@mui/material";
import _ from "lodash";
import { ReactNode } from "react";

const useIndicator = () => {
  const numberOfPlayers = !useSettingsStore.use.isNumberOfPlayersSet();
  const formations = useSettingsStore.use.formations();

  const isSetFormationsDisabled = _.isEqual(
    Object.create(null),
    Object.entries(formations).reduce(
      (acc, [key, { positions, name }]) => ({
        ...acc,
        [key]: { positions, name },
      }),
      {}
    )
  );

  return { numberOfPlayers, formations: isSetFormationsDisabled };
};

const Indicator = ({
  children,
  id,
}: {
  children: ReactNode;
  id: "numberOfPlayers" | "formations";
}) => {
  const paramNotSet = useIndicator()[id];

  return paramNotSet ? (
    <Tooltip
      title="You have to set this to create any plays."
      arrow
      placement="right-end"
      slotProps={{
        popper: {
          modifiers: [{ name: "offset", options: { offset: [-20, 10] } }],
        },
      }}
    >
      <Badge badgeContent=" " color="error" variant="dot">
        {children}
      </Badge>
    </Tooltip>
  ) : (
    children
  );
};

export default Indicator;
