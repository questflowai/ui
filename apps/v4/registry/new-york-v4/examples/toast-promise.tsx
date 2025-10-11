"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function ToastPromise() {
  const { toast } = useToast()

  const handleClick = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure
        Math.random() > 0.5
          ? resolve({ name: "Data" })
          : reject("Error occurred")
      }, 2000)
    })

    toast.promise(promise, {
      loading: "Loading data...",
      success: (data) => {
        return `Data loaded successfully!`
      },
      error: (err) => {
        return `Failed to load data: ${err}`
      },
    })
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      Show Promise Toast
    </Button>
  )
}
