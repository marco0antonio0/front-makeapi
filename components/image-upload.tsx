"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const maxSize = 800
      let { width, height } = img

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      const base64 = canvas.toDataURL("image/jpeg", 0.8)
      resolve(base64)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      try {
        const optimizedBase64 = await optimizeImage(file)
        onChange(optimizedBase64)
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error)
      } finally {
        setUploading(false)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeImage = () => {
    onChange("")
  }

  return (
    <div className={className}>
      {value ? (
        <Card className="relative group">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img src={value || "/placeholder.svg"} alt="Upload preview" className="w-full h-full object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 ${
            isDragActive ? "border-primary bg-primary/5" : "border-border"
          } ${uploading ? "opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className={`rounded-full p-4 mb-4 ${isDragActive ? "bg-primary/10" : "bg-muted"}`}>
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <ImageIcon className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {uploading ? "Otimizando imagem..." : isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {uploading ? "Comprimindo e convertendo..." : "ou clique para selecionar"}
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Upload className="h-3 w-3" />
              <span>PNG, JPG, GIF até 5MB</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
