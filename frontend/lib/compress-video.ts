import { FFmpeg } from "@ffmpeg/ffmpeg"
import {
  fetchFile,
  toBlobURL,
} from "@ffmpeg/util"

const MAX_VIDEO_SIZE =
  10 * 1024 * 1024

const TARGET_VIDEO_SIZE =
  9.5 * 1024 * 1024

const CORE_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd"

let ffmpegInstance: FFmpeg | null = null
let ffmpegLoadingPromise:
  | Promise<FFmpeg>
  | null = null

export type VideoCompressionProgress = {
  stage:
    | "loading"
    | "compressing"
    | "checking"
  progress: number
}

type CompressVideoOptions = {
  onProgress?: (
    progress: VideoCompressionProgress,
  ) => void
}

async function getFFmpeg(
  onProgress?: (
    progress: VideoCompressionProgress,
  ) => void,
): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) {
    return ffmpegInstance
  }

  if (ffmpegLoadingPromise) {
    return ffmpegLoadingPromise
  }

  ffmpegLoadingPromise = (async () => {
    onProgress?.({
      stage: "loading",
      progress: 0,
    })

    const ffmpeg = new FFmpeg()

    ffmpeg.on(
      "progress",
      ({ progress }) => {
        const normalizedProgress =
          Math.min(
            Math.max(progress, 0),
            1,
          )

        onProgress?.({
          stage: "compressing",
          progress: Math.round(
            normalizedProgress * 100,
          ),
        })
      },
    )

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${CORE_BASE_URL}/ffmpeg-core.js`,
        "text/javascript",
      ),

      wasmURL: await toBlobURL(
        `${CORE_BASE_URL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    })

    ffmpegInstance = ffmpeg

    onProgress?.({
      stage: "loading",
      progress: 100,
    })

    return ffmpeg
  })()

  try {
    return await ffmpegLoadingPromise
  } finally {
    ffmpegLoadingPromise = null
  }
}

function getFileExtension(
  fileName: string,
) {
  const extension =
    fileName.split(".").pop()

  if (
    !extension ||
    extension === fileName
  ) {
    return "mp4"
  }

  return extension.toLowerCase()
}

function createSafeFileName(
  prefix: string,
  extension: string,
) {
  const randomPart =
    Math.random()
      .toString(36)
      .slice(2, 10)

  return `${prefix}-${Date.now()}-${randomPart}.${extension}`
}

async function removeFFmpegFile(
  ffmpeg: FFmpeg,
  fileName: string,
) {
  try {
    await ffmpeg.deleteFile(fileName)
  } catch {
    // El archivo puede no existir si FFmpeg falló.
  }
}

async function executeCompression({
  ffmpeg,
  originalFile,
  inputName,
  outputName,
  crf,
  scale,
}: {
  ffmpeg: FFmpeg
  originalFile: File
  inputName: string
  outputName: string
  crf: number
  scale: string
}) {
  await ffmpeg.writeFile(
    inputName,
    await fetchFile(originalFile),
  )

  const exitCode = await ffmpeg.exec([
    "-i",
    inputName,

    "-vf",
    `scale=${scale}:force_original_aspect_ratio=decrease`,

    "-c:v",
    "libx264",

    "-preset",
    "veryfast",

    "-crf",
    String(crf),

    "-c:a",
    "aac",

    "-b:a",
    "96k",

    "-movflags",
    "+faststart",

    "-pix_fmt",
    "yuv420p",

    "-y",
    outputName,
  ])

  if (exitCode !== 0) {
    throw new Error(
      "No se pudo comprimir el video.",
    )
  }

  const outputData =
    await ffmpeg.readFile(outputName)

  if (
    typeof outputData === "string"
  ) {
    throw new Error(
      "FFmpeg devolvió un formato de video inesperado.",
    )
  }

  const bytes =
    outputData instanceof Uint8Array
      ? outputData
      : new Uint8Array(outputData)

  return new Blob(
    [bytes],
    {
      type: "video/mp4",
    },
  )
}

export async function compressVideo(
  video: File,
  options: CompressVideoOptions = {},
): Promise<File> {
  if (!video.type.startsWith("video/")) {
    throw new Error(
      "El archivo seleccionado no es un video válido.",
    )
  }

  if (video.size <= MAX_VIDEO_SIZE) {
    return video
  }

  const { onProgress } = options

  const ffmpeg =
    await getFFmpeg(onProgress)

  const inputExtension =
    getFileExtension(video.name)

  const inputName =
    createSafeFileName(
      "entrada",
      inputExtension,
    )

  const firstOutputName =
    createSafeFileName(
      "salida-720p",
      "mp4",
    )

  const secondOutputName =
    createSafeFileName(
      "salida-640p",
      "mp4",
    )

  try {
    onProgress?.({
      stage: "compressing",
      progress: 0,
    })

    const firstBlob =
      await executeCompression({
        ffmpeg,
        originalFile: video,
        inputName,
        outputName:
          firstOutputName,
        crf: 30,
        scale:
          "min(1280\\,iw):-2",
      })

    onProgress?.({
      stage: "checking",
      progress: 100,
    })

    if (
      firstBlob.size <=
      TARGET_VIDEO_SIZE
    ) {
      return new File(
        [firstBlob],
        `${
          video.name.replace(
            /\.[^/.]+$/,
            "",
          ) || "video"
        }-comprimido.mp4`,
        {
          type: "video/mp4",
          lastModified: Date.now(),
        },
      )
    }

    await removeFFmpegFile(
      ffmpeg,
      inputName,
    )

    await removeFFmpegFile(
      ffmpeg,
      firstOutputName,
    )

    onProgress?.({
      stage: "compressing",
      progress: 0,
    })

    const secondBlob =
      await executeCompression({
        ffmpeg,
        originalFile: video,
        inputName,
        outputName:
          secondOutputName,
        crf: 35,
        scale:
          "min(854\\,iw):-2",
      })

    onProgress?.({
      stage: "checking",
      progress: 100,
    })

    if (
      secondBlob.size >
      MAX_VIDEO_SIZE
    ) {
      const finalSize =
        (
          secondBlob.size /
          (1024 * 1024)
        ).toFixed(1)

      throw new Error(
        `El video quedó en ${finalSize} MB después de comprimirlo. Recórtalo o selecciona uno más corto.`,
      )
    }

    return new File(
      [secondBlob],
      `${
        video.name.replace(
          /\.[^/.]+$/,
          "",
        ) || "video"
      }-comprimido.mp4`,
      {
        type: "video/mp4",
        lastModified: Date.now(),
      },
    )
  } catch (error) {
    console.error(
      "Error comprimiendo video:",
      error,
    )

    if (error instanceof Error) {
      throw error
    }

    throw new Error(
      "No fue posible adaptar el video desde el navegador.",
    )
  } finally {
    await removeFFmpegFile(
      ffmpeg,
      inputName,
    )

    await removeFFmpegFile(
      ffmpeg,
      firstOutputName,
    )

    await removeFFmpegFile(
      ffmpeg,
      secondOutputName,
    )
  }
}