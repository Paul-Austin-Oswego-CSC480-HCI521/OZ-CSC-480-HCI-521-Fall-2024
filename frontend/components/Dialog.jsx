import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export function DialogDemo({ isOpen, onAction }) {
  return (
      <Dialog open={isOpen} onOpenChange={() => onAction(false)}>
        <DialogContent className="sm:max-w-[585px]">
          <DialogHeader>
            <DialogTitle className="flex justify-left text-xl">
             Delete this task?
            </DialogTitle>
            <span className='' style={{ color: '#5f6368' }}>
            This action cannot be undone. This will permanently delete your task and remove your data from our servers.
            </span>
          </DialogHeader>
          <div className="gap-4 py-4 flex justify-end">
            <div className="flex flex-row gap-3">
              <Button
                  type="button"
                  variant="cancel"
                  onClick={() => onAction("cancel")}
              >
                Cancel
              </Button>
              <Button
                  type="button"
                  variant="delete"
                  onClick={() => onAction("delete")}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}


DialogDemo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onAction: PropTypes.func.isRequired,
};
