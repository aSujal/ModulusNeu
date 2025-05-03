import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface FileUploaderProps {
    files: File[]
    setFiles: (files: File[]) => void
    maxFiles?: number
    maxSize?: number // in MB
}

export function FileUploader({ files, setFiles, maxFiles = 5, maxSize = 5 }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (fileList: FileList) => {
        if (files.length + fileList.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files.`)
            return
        }

        const newFiles = Array.from(fileList).filter((file) => {
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
                return false
            }
            return true
        })

        setFiles([...files, ...newFiles])
    }

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const openFileDialog = () => {
        inputRef.current?.click()
    }

    return (
        <div className="space-y-4">
            <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <input ref={inputRef} type="file" multiple onChange={handleChange} className="hidden" />
                <div className="flex flex-col justify-center items-center text-center">
                    <Upload className="mb-2 w-10 h-10 text-muted-foreground" />
                    <p className="mb-1 font-medium text-sm">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Up to {maxFiles} files, {maxSize}MB per file
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={openFileDialog} className="mt-4">
                    Select Files
                </Button>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1 truncate">
                                <div className="text-sm">{file.name}</div>
                                <div className="text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Remove file</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
