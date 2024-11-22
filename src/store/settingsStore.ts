import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { createSelectors } from "./utils";
import { DEFAULT_PLAYERS } from "@/constants/positions";
import { COLORS } from "@/constants/colors";
import { Position } from "@/types/play";

type SettingsState = {
  numberOfPlayers: number;
  isNumberOfPlayersSet: boolean;
  isFormationsSet: boolean;
  colors: string[];
  formations: Record<
    string,
    {
      positions: Position[];
      name: string;
      selectedPosition?: Position;
      image?: string;
    }
  >;
  setNumberOfPlayers: (players: number) => void;
  setColors: (colors: string[]) => void;
  setFormations: (
    formations: Record<string, { positions: Position[]; name: string }>
  ) => void;
  setFormationLabels: (id: string, labels: string[]) => void;
};

const useSettingsStoreBase = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        numberOfPlayers: DEFAULT_PLAYERS,
        isNumberOfPlayersSet: false,
        formations: {},
        isFormationsSet: false,
        setNumberOfPlayers: (players) =>
          set(
            (state) => ({
              isNumberOfPlayersSet: true,
              numberOfPlayers: players,
              formations:
                state.numberOfPlayers === players ? state.formations : {},
            }),
            undefined,
            { type: "settingsStore/setNumberOfPlayers", players }
          ),
        colors: Array.from(
          { length: DEFAULT_PLAYERS },
          (_, index) => COLORS[index]
        ),
        setColors: (colors) =>
          set(
            () => ({
              colors,
              shouldUpdatePlays: true,
            }),
            undefined,
            { type: "settingsStore/setColors", colors }
          ),
        setFormations: (formations) =>
          set(
            () => ({
              formations: Object.keys(formations).reduce(
                (acc, id) => ({
                  ...acc,
                  [id]: { ...formations[id], selectedPosition: undefined },
                }),
                {}
              ),
            }),
            undefined,
            { type: "settingsStore/setFormations", formations }
          ),
        setFormationLabels: (id, labels) =>
          set((state) => ({
            formations: {
              ...state.formations,
              [id]: {
                ...state.formations[id],
                positions: state.formations[id].positions.map(
                  (position, index) => ({ ...position, label: labels[index] })
                ),
              },
            },
          })),
      }),
      {
        name: "settingsStore",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          numberOfPlayers: state.numberOfPlayers,
          isNumberOfPlayersSet: state.isNumberOfPlayersSet,
          isFormationsSet: state.isFormationsSet,
          colors: state.colors,
          formations: state.formations,
        }),
      }
    ),
    { name: "settingsStore" }
  )
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);
