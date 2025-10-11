"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastInfo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast.info({
          title: "New update available",
          description: "Version 2.0.0 is now available for download.",
        })
      }}
    >
      Show Info Toast
    </Button>
  )
}
