"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

export default function ToastDestructive() {
  const { toast } = useToast()

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          // Legacy "destructive" variant - backward compatible
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }}
      >
        Legacy Destructive
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          // Modern "error" variant
          toast.error({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: {
              label: "Try again",
              onClick: () => console.log("Retry"),
            },
          })
        }}
      >
        Modern Error
      </Button>
    </div>
  )
}
