"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/crop-image";
import { Button } from "@/components/ui/Button";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <h2 className="font-display text-lg font-bold">Potong Gambar (21:9)</h2>
        <Button variant="ghost" onClick={onCancel} className="text-white hover:bg-white/20">Batal</Button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={21 / 9}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="flex items-center justify-center gap-6 bg-ink px-6 py-6">
        <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e) => setZoom(Number(e.target.value))} className="w-64" />
        <Button onClick={handleSave} disabled={isProcessing}>
          {isProcessing ? "Memproses..." : "Simpan & Upload"}
        </Button>
      </div>
    </div>
  );
}
