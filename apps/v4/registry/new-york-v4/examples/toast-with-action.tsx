"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

export default function ToastWithAction() {
  const { toast } = useToast()

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          // Legacy API - backward compatible
          toast({
            title: "Event created",
            description: "Your event has been created successfully.",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          })
        }}
      >
        Legacy API
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          // Modern API - simpler
          toast({
            title: "Event created",
            description: "Your event has been created successfully.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo clicked"),
            },
          })
        }}
      >
        Modern API
      </Button>
    </div>
  )
}
