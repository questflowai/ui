"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastWithClose() {
  const { toast, dismiss } = useToast()

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Persistent notification",
            description: "This toast will stay until you dismiss it.",
            duration: Infinity,
          })
        }}
      >
        Show Persistent Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          dismiss()
        }}
      >
        Dismiss All
      </Button>
    </div>
  )
}
