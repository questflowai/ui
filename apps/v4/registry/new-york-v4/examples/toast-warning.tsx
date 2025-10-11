"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastWarning() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast.warning({
          title: "Warning!",
          description: "Please review your input before proceeding.",
        })
      }}
    >
      Show Warning Toast
    </Button>
  )
}
