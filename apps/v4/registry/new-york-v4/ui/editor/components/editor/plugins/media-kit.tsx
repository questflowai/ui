"use client"

import { CaptionPlugin } from "@platejs/caption/react"
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from "@platejs/media/react"
import { KEYS } from "platejs"

import { AudioElement } from "@/registry/new-york-v4/ui/editor/ui/media-audio-node"
import { MediaEmbedElement } from "@/registry/new-york-v4/ui/editor/ui/media-embed-node"
import { FileElement } from "@/registry/new-york-v4/ui/editor/ui/media-file-node"
import { ImageElement } from "@/registry/new-york-v4/ui/editor/ui/media-image-node"
import { PlaceholderElement } from "@/registry/new-york-v4/ui/editor/ui/media-placeholder-node"
import { MediaPreviewDialog } from "@/registry/new-york-v4/ui/editor/ui/media-preview-dialog"
import { MediaUploadToast } from "@/registry/new-york-v4/ui/editor/ui/media-upload-toast"
import { VideoElement } from "@/registry/new-york-v4/ui/editor/ui/media-video-node"

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: { afterEditable: MediaPreviewDialog, node: ImageElement },
  }),
  MediaEmbedPlugin.withComponent(MediaEmbedElement),
  VideoPlugin.withComponent(VideoElement),
  AudioPlugin.withComponent(AudioElement),
  FilePlugin.withComponent(FileElement),
  PlaceholderPlugin.configure({
    options: { disableEmptyPlaceholder: true },
    render: { afterEditable: MediaUploadToast, node: PlaceholderElement },
  }),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file, KEYS.mediaEmbed],
      },
    },
  }),
]
