import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ChoosePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaySuccess?: () => void;
}

export default function ChoosePlanModal({
  open,
  onOpenChange,
}: ChoosePlanModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      onOpenChange(false);
      router.push("/dashboard/plan");
    }
  }, [open, onOpenChange, router]);

  return (
    <Dialog open={false} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Upgrade your plan
          </DialogTitle>
          <DialogDescription>
            Redirecting to plans and pricing…
          </DialogDescription>
        </DialogHeader>
        <Button variant="hero" onClick={() => router.push("/dashboard/plan")}>
          Go to Plans
        </Button>
      </DialogContent>
    </Dialog>
  );
}
