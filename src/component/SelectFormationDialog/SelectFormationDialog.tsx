import { Dialog, DialogTitle } from "@mui/material";
import SelectFormationDialogContent from "./SelectFormationDialogContent/SelectFormationDialogContent";

type SelectFormationDialogProps = {
  isOpened: boolean;
  handleClose: () => void;
  formations: Record<string, { name: string; image?: string }>;
};

const SelectFormationDialog = ({
  isOpened,
  handleClose,
  formations,
}: SelectFormationDialogProps) => {
  return (
    <Dialog
      fullWidth
      scroll="paper"
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="select-formation-dialog-title"
      aria-describedby="select-formation-dialog-desc"
    >
      <DialogTitle id="select-formation-dialog-title">
        Select Formation
      </DialogTitle>
      <SelectFormationDialogContent
        formations={formations}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default SelectFormationDialog;
