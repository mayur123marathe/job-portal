import { useRef } from "react"
import { Camera, ImagePlus, Loader2 } from "lucide-react"
import { getInitials } from "./profileUtils"

export default function AvatarUpload({ currentImage, userName, uploading, onFileSelect }) {
  const fileRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    e.target.value = ""
  }

  return (
    <div className="relative group shrink-0">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="relative h-24 w-24 rounded-2xl border-4 border-white bg-brand shadow-lg overflow-hidden cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {currentImage ? (
          <img src={currentImage} alt={userName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-white text-2xl font-bold flex items-center justify-center h-full w-full">
            {getInitials(userName)}
          </span>
        )}

        <div
          className={[
            "absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all duration-200",
            uploading ? "bg-black/60" : "bg-black/0 group-hover:bg-black/50",
          ].join(" ")}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <>
              <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Change
              </span>
            </>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="Upload photo"
        className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-brand border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:bg-brand/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ImagePlus className="h-3.5 w-3.5 text-white" />
      </button>
    </div>
  )
}
