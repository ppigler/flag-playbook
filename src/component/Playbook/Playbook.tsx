"use client";

import { usePlayStore } from "@/store/playStore";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Grid2 as Grid } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import PlaybookItem from "../PlaybookItem/PlaybookItem";
import NewPlayCard from "../NewPlayCard/NewPlayCard";
import SelectFormationDialog from "../SelectFormationDialog/SelectFormationDialog";
import { useSettingsStore } from "@/store/settingsStore";
import PlaybookItemDragOverlay from "../PlaybookItemDragOverlay/PlaybookItemDragOverlay";

const Playbook = () => {
  const [activeId, setActiveId] = useState<null | string>(null);
  const deletePlay = usePlayStore.use.deletePlay();
  const orderPlay = usePlayStore.use.orderPlay();
  const plays = usePlayStore(useShallow((state) => state.plays));
  const formations = useSettingsStore.use.formations();

  const [isFormationDialogOpened, setIsFormationDialogOpened] = useState(false);

  const playIds = useMemo(
    () =>
      Object.entries(plays)
        .map(([playId, play]) => ({ ...play, playId }))
        .sort((a, b) => a.order - b.order)
        .map(({ playId }) => playId),
    [plays]
  );

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id + "");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const newOrder = playIds.indexOf(over?.id + "");
    if (newOrder != -1 && active.id !== over?.id) {
      orderPlay(active.id + "", newOrder);
    }

    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ width: "100%", paddingBlock: 3 }}
        >
          <SortableContext items={playIds}>
            {playIds.map((id, idx) => {
              const playName = idx + 1;
              const playUrl = `plays/${id}`;
              const image = plays[id]?.image;
              return (
                <PlaybookItem
                  key={id}
                  playId={id}
                  playName={playName + ""}
                  href={playUrl}
                  image={image}
                  deletePlayHandler={() => deletePlay(id)}
                />
              );
            })}
            <DragOverlay modifiers={[restrictToWindowEdges]}>
              {activeId ? <PlaybookItemDragOverlay id={activeId} /> : null}
            </DragOverlay>
          </SortableContext>
          <NewPlayCard
            size={{ xs: 6, md: 3 }}
            handleOnClick={handleFormationDialogOpen}
          />
        </Grid>
      </DndContext>
    </>
  );
};

export default Playbook;
