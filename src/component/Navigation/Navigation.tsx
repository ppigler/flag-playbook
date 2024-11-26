"use client";

import { usePlayStore } from "@/store/playStore";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  TbPrinter,
  TbSettings,
  TbSquareRoundedPlus,
  TbArrowBack,
  TbCaretLeft,
  TbCaretRight,
} from "react-icons/tb";
import SelectFormationDialog from "../SelectFormationDialog/SelectFormationDialog";
import { useSettingsStore } from "@/store/settingsStore";
import { usePathname } from "next/navigation";
import { usePlaybookStore } from "@/store/playbookStore";
import Link from "next/link";

const Navigation = () => {
  const pathname = usePathname();

  const plays = usePlayStore.use.plays();
  const currentPlay = usePlaybookStore.use.playId();
  const formations = useSettingsStore.use.formations();

  const [isFormationDialogOpened, setIsFormationDialogOpened] = useState(false);

  const isPlaysPage = useMemo(() => pathname === "/", [pathname]);
  const isPlayPage = useMemo(() => pathname.includes("/plays"), [pathname]);

  const isExportPlaysDisabled = useMemo(
    () => Object.keys(plays).length === 0,
    [plays]
  );
  const orderedPlays = useMemo(
    () =>
      Object.entries(plays)
        .sort((a, b) => a[1].order - b[1].order)
        .map(([key]) => key),
    [plays]
  );
  const previousPlay = useMemo(
    () => orderedPlays[orderedPlays.indexOf(currentPlay!) - 1],
    [currentPlay, orderedPlays]
  );
  const nextPlay = useMemo(
    () => orderedPlays[orderedPlays.indexOf(currentPlay!) + 1],
    [currentPlay, orderedPlays]
  );

  const handleFormationDialogOpen = useCallback(
    () => setIsFormationDialogOpened(true),
    [setIsFormationDialogOpened]
  );
  const handleFormationDialogClose = useCallback(
    () => setIsFormationDialogOpened(false),
    [setIsFormationDialogOpened]
  );

  return (
    <>
      <SelectFormationDialog
        formations={formations}
        isOpened={isFormationDialogOpened}
        handleClose={handleFormationDialogClose}
      />
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomNavigation showLabels value={pathname}>
          {isPlaysPage ? null : (
            <BottomNavigationAction
              label="back"
              aria-label="back"
              icon={<TbArrowBack size={25} />}
              href="/"
              LinkComponent={Link}
            />
          )}
          {isPlaysPage ? (
            <BottomNavigationAction
              label="Create new play"
              aria-label="Create new play"
              icon={<TbSquareRoundedPlus size={25} />}
              onClick={handleFormationDialogOpen}
            />
          ) : null}
          {isPlaysPage ? (
            <BottomNavigationAction
              label="Export PDF"
              aria-label="Export PDF"
              icon={<TbPrinter size={25} />}
              href="/export"
              LinkComponent={Link}
              disabled={isExportPlaysDisabled}
            />
          ) : null}
          {isPlayPage ? (
            <BottomNavigationAction
              label="previous play"
              aria-label="previous play"
              disabled={!previousPlay}
              icon={<TbCaretLeft size={25} />}
              href={`/plays/${previousPlay}`}
              LinkComponent={Link}
            />
          ) : null}
          {isPlayPage ? (
            <BottomNavigationAction
              label="next play"
              aria-label="next play"
              disabled={!nextPlay}
              icon={<TbCaretRight size={25} />}
              href={`/plays/${nextPlay}`}
              LinkComponent={Link}
            />
          ) : null}
          {isPlaysPage ? (
            <BottomNavigationAction
              label="Settings"
              aria-label="Settings"
              icon={<TbSettings size={25} />}
              href="/settings"
              LinkComponent={Link}
              value="/settings"
            />
          ) : null}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navigation;
