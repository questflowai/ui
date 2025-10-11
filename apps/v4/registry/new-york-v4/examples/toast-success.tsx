"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastSuccess() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast.success({
          title: "Success!",
          description: "Your changes have been saved successfully.",
        })
      }}
    >
      Show Success Toast
    </Button>
  )
}
