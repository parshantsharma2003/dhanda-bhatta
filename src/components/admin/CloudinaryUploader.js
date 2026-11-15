"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Video, Loader2, AlertCircle, Link as LinkIcon, Check } from "lucide-react";

export default function CloudinaryUploader({
  folder = "dbc/products",
  resourceType = "image",
  onUploadSuccess,
  buttonLabel = "Upload Media",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setErrorMessage("");
    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1. Request signature from server API
      const signRes = await fetch("/api/admin/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder,
          resourceType,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const signData = await signRes.json();

      if (!signRes.ok || !signData.success) {
        throw new Error(signData.message || "Failed to generate Cloudinary signature");
      }

      const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = signData.data;

      setUploadProgress(30);

      // 2. Upload directly to Cloudinary API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", targetFolder);

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      setUploadProgress(50);

      const uploadRes = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);

      if (!uploadRes.ok) {
        const errorJson = await uploadRes.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `Cloudinary upload failed with status ${uploadRes.status}`);
      }

      const uploadResult = await uploadRes.json();
      setUploadProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          resourceType: uploadResult.resource_type,
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.warn("[CloudinaryUploader] Direct upload error:", err.message);
      setErrorMessage(`${err.message}. You can also provide an image URL directly.`);
      setShowUrlFallback(true);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleApplyFallbackUrl = (e) => {
    e.preventDefault();
    if (!fallbackUrl.trim()) return;

    if (onUploadSuccess) {
      onUploadSuccess({
        url: fallbackUrl.trim(),
        publicId: `external-${Date.now()}`,
        format: fallbackUrl.split(".").pop() || "jpg",
        isExternal: true,
      });
    }
    setFallbackUrl("");
    setShowUrlFallback(false);
    setErrorMessage("");
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="p-3 bg-[#FFEBEE] border-l-4 border-terracotta text-xs text-charcoal flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Upload Notice:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={resourceType === "video" ? "video/*" : "image/*"}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={`cloudinary-file-input-${folder.replace(/\//g, "-")}`}
        />

        <label
          htmlFor={`cloudinary-file-input-${folder.replace(/\//g, "-")}`}
          className={`inline-flex items-center gap-2 px-3 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading ({uploadProgress}%)...</span>
            </>
          ) : (
            <>
              {resourceType === "video" ? (
                <Video className="w-3.5 h-3.5 text-sandstone" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-sandstone" />
              )}
              <span>{buttonLabel}</span>
            </>
          )}
        </label>

        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-xs text-secondary-text hover:text-charcoal underline px-2 py-1 cursor-pointer"
        >
          {showUrlFallback ? "Hide URL Option" : "Or paste direct media URL"}
        </button>
      </div>

      {showUrlFallback && (
        <form onSubmit={handleApplyFallbackUrl} className="flex items-center gap-2 max-w-md pt-1">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-secondary-text absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://example.com/images/brick.jpg"
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal focus:outline-none focus:border-terracotta"
            />
          </div>
          <button
            type="submit"
            disabled={!fallbackUrl.trim()}
            className="px-3 py-1.5 bg-sandstone hover:bg-[#A8885B] text-charcoal font-heading font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            Apply URL
          </button>
        </form>
      )}
    </div>
  );
}
