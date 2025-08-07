import { Button } from "@/registry/new-york-v4/ui/button"

function HelloWorld() {
  return <Button>Hello World</Button>
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <HelloWorld />
      </div>
    </div>
  )
}
