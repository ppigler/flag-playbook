import { create } from "zustand";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import { createRef, RefObject } from "react";
import { Stage } from "konva/lib/Stage";
import { createSelectors } from "./utils";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type Play = {
  order: number;
  formationId: string;
  isRun: boolean;
  ref: RefObject<Stage>;
  playNote?: string;
  image?: string;
};

type PlayStoreState = {
  plays: Record<string, Play>;
  createPlay: (formationId: string) => void;
  deletePlay: (playId: string) => void;
  orderPlay: (playId: string, order: number) => void;
  renderImages: (playId: string, image: string) => void;
  resetImages: () => void;
};

const usePlayStoreBase = create<
  PlayStoreState,
  [["zustand/devtools", never], ["zustand/persist", Partial<PlayStoreState>]]
>(
  devtools(
    persist(
      (set) => ({
        plays: {},
        createPlay: (formationId) =>
          set(
            (state) => {
              return {
                plays: {
                  ...state.plays,
                  [uuid()]: {
                    formationId,
                    order: Object.keys(state.plays).length,
                    isRun: false,
                    ref: createRef<Stage>(),
                  },
                },
              };
            },
            undefined,
            "playstore/createPlay"
          ),
        renderImages: (playId: string, image: string) =>
          set(
            (state) => {
              return {
                plays: {
                  ...state.plays,
                  [playId]: { ...state.plays[playId], image },
                },
              };
            },
            undefined,
            { type: "playstore/renderImages", playId, image }
          ),
        deletePlay: (playId: string) => {
          localStorage.removeItem(playId);
          set(
            (state) => ({
              plays: _.omit(state.plays, [playId]),
            }),
            undefined,
            { type: "playStore/deletePlay", playId }
          );
        },
        orderPlay: (playId: string, newOrder: number) =>
          set(
            (state) => {
              const movingPlay = state.plays[playId];
              const movingPlayOrder = movingPlay.order;
              if (!movingPlay) return {};
              return {
                plays: Object.keys(state.plays).reduce((acc, id) => {
                  const currentPlay = state.plays[id];
                  const currentPlayOrder = currentPlay.order;

                  if (id === playId)
                    return { ...acc, [id]: { ...movingPlay, order: newOrder } };

                  if (movingPlayOrder < newOrder)
                    return {
                      ...acc,
                      [id]: {
                        ...currentPlay,
                        order:
                          currentPlayOrder > movingPlayOrder &&
                          currentPlayOrder <= newOrder
                            ? currentPlayOrder - 1
                            : currentPlayOrder,
                      },
                    };

                  if (movingPlayOrder > newOrder)
                    return {
                      ...acc,
                      [id]: {
                        ...currentPlay,
                        order:
                          currentPlayOrder >= newOrder &&
                          currentPlayOrder < movingPlayOrder
                            ? currentPlayOrder + 1
                            : currentPlayOrder,
                      },
                    };
                  return {
                    ...acc,
                    [id]: currentPlay,
                  };
                }, {}),
              };
            },
            undefined,
            { type: "playStore/orderPlay", playId, newOrder }
          ),
        resetImages: () =>
          set((state) => ({
            plays: Object.keys(state.plays).reduce(
              (acc, id) => ({
                ...acc,
                [id]: { ...state.plays[id], image: undefined },
              }),
              {}
            ),
          })),
      }),
      {
        name: "playstore",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          plays: state.plays,
        }),
      }
    ),
    { name: "playStore", enabled: process.env.NODE_ENV === "development" }
  )
);

export const usePlayStore = createSelectors(usePlayStoreBase);
