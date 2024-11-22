import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DeletePlayDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteHandler: () => void;
};
const DeletePlayDialog = ({
  isOpen,
  onClose,
  onDeleteHandler,
}: DeletePlayDialogProps) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Delete play?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You are permanently deleting this play from your playbook.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDeleteHandler}>Delete</Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default DeletePlayDialog;
