"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastError() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast.error({
          title: "Error!",
          description: "There was a problem with your request.",
        })
      }}
    >
      Show Error Toast
    </Button>
  )
}
