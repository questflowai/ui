import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground mt-2">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
