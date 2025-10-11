"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

export default function ToastDemo() {
  const { toast, dismiss } = useToast()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
            })
          }}
        >
          Default
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast.success({
              title: "Success",
              description: "Operation completed successfully!",
            })
          }}
        >
          Success
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast.error({
              title: "Error",
              description: "Something went wrong!",
            })
          }}
        >
          Error
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast.warning({
              title: "Warning",
              description: "Please proceed with caution.",
            })
          }}
        >
          Warning
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast.info({
              title: "Information",
              description: "Here's some useful information.",
            })
          }}
        >
          Info
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // Legacy API - using React element
            toast({
              title: "Event created",
              description: "Your event has been created successfully.",
              action: (
                <ToastAction
                  altText="Undo action"
                  onClick={() => console.log("Undo")}
                >
                  Undo
                </ToastAction>
              ),
            })
          }}
        >
          With Action (Legacy)
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // Modern API - using object
            toast({
              title: "File uploaded",
              description: "Your file has been uploaded.",
              action: {
                label: "View",
                onClick: () => console.log("View clicked"),
              },
            })
          }}
        >
          With Action (Modern)
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // Legacy destructive variant
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
          }}
        >
          Destructive (Legacy)
        </Button>

        <Button
          variant="outline"
          className="sm:col-span-2 md:col-span-3"
          onClick={() => dismiss()}
        >
          Dismiss All Toasts
        </Button>
      </div>
    </div>
  )
}
