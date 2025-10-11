"use client"

import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

export default function ToastCompatibility() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold">Legacy API Examples</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              // Legacy: default variant with description only
              toast({
                description: "Your message has been sent.",
              })
            }}
          >
            Legacy: Simple
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Legacy: with title and description
              toast({
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
              })
            }}
          >
            Legacy: With Title
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Legacy: with React element action
              toast({
                title: "Event created",
                description: "Your event has been created successfully.",
                action: (
                  <ToastAction
                    altText="Goto schedule to undo"
                    onClick={() => console.log("Undo clicked")}
                  >
                    Undo
                  </ToastAction>
                ),
              })
            }}
          >
            Legacy: With Action
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Legacy: destructive variant (auto-mapped to error)
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: (
                  <ToastAction altText="Try again">Try again</ToastAction>
                ),
              })
            }}
          >
            Legacy: Destructive
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Modern API Examples</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => {
              // Modern: default
              toast({
                title: "Default Toast",
                description: "This uses the modern implementation.",
              })
            }}
          >
            Modern: Default
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Modern: success variant
              toast.success({
                title: "Success!",
                description: "Your changes have been saved.",
              })
            }}
          >
            Modern: Success
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Modern: error variant (same as destructive)
              toast.error({
                title: "Error!",
                description: "Something went wrong.",
              })
            }}
          >
            Modern: Error
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Modern: warning variant (new)
              toast.warning({
                title: "Warning!",
                description: "Please review before proceeding.",
              })
            }}
          >
            Modern: Warning
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Modern: info variant (new)
              toast.info({
                title: "Information",
                description: "New version available.",
              })
            }}
          >
            Modern: Info
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Modern: simple object action
              toast({
                title: "File uploaded",
                description: "Your file is ready.",
                action: {
                  label: "View",
                  onClick: () => console.log("View clicked"),
                },
              })
            }}
          >
            Modern: With Action
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Mixed Usage (Both APIs)</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              // Can use both APIs in sequence
              toast({
                variant: "destructive",
                title: "Legacy destructive",
                action: <ToastAction altText="Undo">Undo</ToastAction>,
              })

              setTimeout(() => {
                toast.success({
                  title: "Modern success",
                  description: "Both APIs work together!",
                })
              }, 500)
            }}
          >
            Mixed: Legacy + Modern
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Promise toast (modern only)
              const promise = new Promise((resolve) =>
                setTimeout(resolve, 2000)
              )

              toast.promise(promise, {
                loading: "Loading...",
                success: "Done!",
                error: "Failed!",
              })
            }}
          >
            Modern: Promise Toast
          </Button>
        </div>
      </div>
    </div>
  )
}
