export type Position = {
  x: number;
  y: number;
  key: string;
  id: string;
  index: number;
  isSelected?: boolean;
  isDragging?: boolean;
  isRoundedRoute?: boolean;
  isKey?: boolean;
  color?: string;
  label?: string;
};

export type RouteSegment = {
  x: number;
  y: number;
};

export type Route = {
  route: RouteSegment[];
  option: RouteSegment[];
  motion: number;
};

export type Play = {
  name: string;
};
