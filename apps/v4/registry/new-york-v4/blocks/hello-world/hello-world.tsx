import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"

import Hello from "./components/hello"
import World from "./components/world"
import { formatDate } from "./lib"
import Page from "./page"
import { useTest } from "./test-hook"
import test from "./test.json"

export default function HelloWorld() {
  const date = new Date()
  const formattedDate = formatDate(date)
  const testHook = useTest()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Hello />
        <World />
        <Button>Hello World Button</Button>
        <PlusIcon />
        <pre>{JSON.stringify(test, null, 2)}</pre>
        <pre>{formattedDate}</pre>
        <pre>{testHook}</pre>
      </div>
      <Page />
    </div>
  )
}
