"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { CheckCircle2, PawPrint } from "lucide-react"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onView?: () => void
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  onView,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        <div className="flex flex-col items-center py-4">

          <div className="relative mb-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-11 w-11 text-green-600" />
            </div>

            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow">
              <PawPrint className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">
              {title}
            </DialogTitle>

            <DialogDescription className="mt-2 text-center">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 flex w-full justify-center gap-3">

            {onView && (
              <Button
                onClick={onView}
                className="bg-green-600 hover:bg-green-700"
              >
                Ver sitio
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}