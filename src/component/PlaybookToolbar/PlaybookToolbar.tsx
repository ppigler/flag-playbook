"use client";

import {
  TbArrowBearLeft,
  TbArrowCurveLeft,
  TbRouteAltLeft,
  TbStar,
  TbLineDashed,
  TbSettings,
} from "react-icons/tb";
import { RiDeleteBack2Line } from "react-icons/ri";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { usePlaybookStore } from "@/store/playbookStore";
import { useMemo, useState } from "react";
import RouteOptions from "../RouteOptions/RouteOptions";

const PlaybookToolbar = () => {
  const handleRemoveRoute = usePlaybookStore.use.handleRemoveRoute();
  const toggleRounded = usePlaybookStore.use.toggleRounded();
  const handleToggleIsKey = usePlaybookStore.use.handleToggleIsKey();
  const handleToggleEditOption = usePlaybookStore.use.handleToggleEditOption();
  const handleSetMotion = usePlaybookStore.use.handleSetMotion();
  const isOption = usePlaybookStore.use.isOption();
  const selectedPosition = usePlaybookStore.use.selectedPosition();
  const routes = usePlaybookStore.use.routes();

  const [isAllOptionsOpened, setIsAllOptionsOpened] = useState(false);

  const color = useMemo(() => selectedPosition?.color, [selectedPosition]);
  const toggleEditOptionLabel = useMemo(
    () => (isOption ? "Edit route" : "Edit option"),
    [isOption]
  );
  const toggleRoundedRouteLabel = useMemo(
    () => (selectedPosition?.isRoundedRoute ? "Sharp route" : "Rounded route"),
    [selectedPosition]
  );
  const toggleMotionLabel = useMemo(
    () =>
      routes[selectedPosition?.index ?? 0]?.motion === 0
        ? "Toggle motion"
        : "Remove motion",
    [selectedPosition, routes]
  );
  const toggleIsKeyLabel = useMemo(
    () => (selectedPosition?.isKey ? "Unmark route" : "Mark route"),
    [selectedPosition]
  );

  const actions = [
    {
      name: "Open settings",
      icon: <TbSettings />,
      onClick: () => setIsAllOptionsOpened(true),
    },
    {
      name: "Remove last segment",
      icon: <RiDeleteBack2Line />,
      onClick: () => handleRemoveRoute(),
    },
    {
      name: toggleRoundedRouteLabel,
      icon: <TbArrowCurveLeft />,
      onClick: () => toggleRounded(),
    },

    {
      name: toggleEditOptionLabel,
      icon: <TbRouteAltLeft />,
      onClick: handleToggleEditOption,
    },

    {
      name: toggleIsKeyLabel,
      icon: <TbStar />,
      onClick: () => handleToggleIsKey(),
    },
    {
      name: toggleMotionLabel,
      icon: <TbLineDashed />,
      onClick: () => handleSetMotion(),
    },
  ];

  return (
    <>
      <SpeedDial
        hidden={!selectedPosition}
        ariaLabel="Route menu"
        sx={{ position: "fixed", bottom: 64, right: 16 }}
        icon={<TbArrowBearLeft />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            sx={{ backgroundColor: color }}
          />
        ))}
      </SpeedDial>
      <RouteOptions
        isOpen={isAllOptionsOpened}
        onClose={() => setIsAllOptionsOpened(false)}
        onOpen={() => setIsAllOptionsOpened(true)}
      />
    </>
  );
};

export default PlaybookToolbar;
