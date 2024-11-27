import {
  Breakpoint,
  Button,
  Grid2 as Grid,
  GridSize,
  Tooltip,
} from "@mui/material";
import { TbSquareRoundedPlus } from "react-icons/tb";

type NewPlayCardProps = {
  size: Partial<{ [key in Breakpoint]: GridSize }>;
  disabled?: boolean;
  handleOnClick: () => void;
  tooltipLabel?: string;
};

const NewPlayCard = ({
  disabled,
  handleOnClick,
  size,
  tooltipLabel,
}: NewPlayCardProps) => (
  <Grid size={size}>
    <Tooltip title={tooltipLabel || "create new play"}>
      <Button
        onClick={handleOnClick}
        disabled={disabled}
        fullWidth
        sx={{ height: "100%", minHeight: 220 }}
        variant="contained"
      >
        <TbSquareRoundedPlus size={60} />
      </Button>
    </Tooltip>
  </Grid>
);

export default NewPlayCard;
