import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/server"

import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { DocsTableOfContents } from "@/components/docs-toc"
import { OpenInV0Cta } from "@/components/open-in-v0-cta"
import { Button } from "@/registry/new-york-v4/ui/button"


export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  if (!doc.title || !doc.description) {
    notFound()
  }

  // Ensure page.url is valid before using it
  const pageUrl = page.url || '/docs'

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(pageUrl),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
      creator: "@shadcn",
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const doc = page.data
  // @ts-expect-error - revisit fumadocs types.
  const MDX = doc.body
  const neighbours = await findNeighbour(source.pageTree, page.url)

  // @ts-expect-error - revisit fumadocs types.
  const links = doc.links

  return (
    <div
      data-slot="docs"
      className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <h1 className="mt-0 scroll-m-20 font-bold text-3xl tracking-tighter">
              {doc.title}
            </h1>
            <p className="mb-2 text-lg text-neutral-600 dark:text-neutral-400">
              {doc.description}
            </p>
          </div>

          <MDX components={mdxComponents} />
          {links && links.length > 0 && (
            <div className="not-prose flex flex-col gap-4 border-t pt-8 mt-12">
              <div className="flex flex-col gap-1">
                <div className="font-medium text-sm">Links</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Additional resources and references.
                </div>
              </div>
              <div className="space-y-1">
                {links.map((link: { title: string; url: string }, idx: number) => (
                  <Link
                    key={idx}
                    href={link.url}
                    className="group flex items-center gap-1 text-neutral-800 text-sm underline-offset-2 hover:underline dark:text-neutral-300"
                  >
                    {link.title}
                    <IconArrowUpRight className="size-3 group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {neighbours.next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              asChild
            >
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <IconArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {/* @ts-expect-error - revisit fumadocs types. */}
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            {/* @ts-expect-error - revisit fumadocs types. */}
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-12 px-6">
          <OpenInV0Cta />
          <div className="mt-12 flex flex-row items-center justify-between">
            {neighbours.previous ? (
              <Link
                href={neighbours.previous.url}
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <IconArrowLeft className="size-4" />
                  Previous
                </div>
                <div className="font-medium text-sm">{neighbours.previous.name}</div>
              </Link>
            ) : (
              <div />
            )}
            {neighbours.next ? (
              <Link
                href={neighbours.next.url}
                className="flex flex-col gap-2 rounded-lg border p-4 text-right transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Next
                  <IconArrowRight className="size-4" />
                </div>
                <div className="font-medium text-sm">{neighbours.next.name}</div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
      {/* @ts-expect-error - revisit fumadocs types. */}
      <DocsTableOfContents toc={doc.toc} />
    </div>
  )
}
