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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-2xl">
              Delete the task?
            </DialogTitle>
          </DialogHeader>
          <div className="gap-4 py-4 flex justify-center">
            <div className="flex flex-col gap-3">
              <Button
                  type="button"
                  onClick={() => onAction("delete")}
              >
                Delete
              </Button>
              <Button
                  className="bg-white text-black underline hover:bg-none"
                  type="button"
                  onClick={() => onAction("cancel")}
              >
                Cancel
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
