"use client";

import {
  TbArrowBearLeft,
  TbArrowCurveLeft,
  TbRouteAltLeft,
  TbStar,
  TbLineDashed,
} from "react-icons/tb";
import { RiDeleteBack2Line } from "react-icons/ri";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { usePlaybookStore } from "@/store/playbookStore";

const PlaybookToolbar = () => {
  const handleRemoveRoute = usePlaybookStore.use.handleRemoveRoute();
  const toggleRounded = usePlaybookStore.use.toggleRounded();
  const handleToggleIsKey = usePlaybookStore.use.handleToggleIsKey();
  const handleToggleEditOption = usePlaybookStore.use.handleToggleEditOption();
  const isOption = usePlaybookStore.use.isOption();
  const selectedPosition = usePlaybookStore.use.selectedPosition();
  const handleSetMotion = usePlaybookStore.use.handleSetMotion();
  const routes = usePlaybookStore.use.routes() ?? [];

  const toggleEditOptionLabel = isOption ? "Edit route" : "Edit option";
  const toggleRoundedRouteLabel = selectedPosition?.isRoundedRoute
    ? "Sharp route"
    : "Rounded route";
  const toggleMotionLabel =
    routes[selectedPosition?.index ?? 0]?.motion === 0
      ? "Toggle motion"
      : "Remove motion";

  const toggleIsKeyLabel = selectedPosition?.isKey
    ? "Unmark route"
    : "Mark route";

  const actions = [
    {
      name: "Remove last segment",
      icon: <RiDeleteBack2Line />,
      onClick: handleRemoveRoute,
    },
    {
      name: toggleRoundedRouteLabel,
      icon: <TbArrowCurveLeft />,
      onClick: toggleRounded,
    },

    {
      name: toggleEditOptionLabel,
      icon: <TbRouteAltLeft />,
      onClick: handleToggleEditOption,
    },

    { name: toggleIsKeyLabel, icon: <TbStar />, onClick: handleToggleIsKey },
    {
      name: toggleMotionLabel,
      icon: <TbLineDashed />,
      onClick: () => handleSetMotion(),
    },
  ];

  return (
    <SpeedDial
      hidden={!selectedPosition}
      ariaLabel="Route menu"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<TbArrowBearLeft />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default PlaybookToolbar;
