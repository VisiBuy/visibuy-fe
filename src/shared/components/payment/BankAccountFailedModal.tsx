import React from "react";
import { XCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface BankAccountFailedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage?: string;
  onRetry?: () => void;
}

export const BankAccountFailedModal: React.FC<BankAccountFailedModalProps> = ({
  open,
  onOpenChange,
  errorMessage,
  onRetry,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center py-space-32 px-space-24 space-y-space-24">
          {/* Error Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger/10">
            <XCircle className="h-10 w-10 text-danger" />
          </div>

          {/* Error Message */}
          <div className="text-center space-y-space-8">
            <h3 className="text-h5-desktop font-bold text-neutral-900">
              Failed to Add Bank Account
            </h3>
            <p className="text-body-medium text-neutral-600">
              {errorMessage ||
                "An error occurred while adding your bank account. Please try again."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-space-12 w-full">
            <Button
              variant="outline"
              size="default"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {onRetry && (
              <Button
                variant="default"
                size="default"
                className="flex-1"
                onClick={() => {
                  onRetry();
                  onOpenChange(false);
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
