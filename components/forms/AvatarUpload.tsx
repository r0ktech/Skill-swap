"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AvatarUpload() {
  const { user, updateAvatar } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      alert("File size must be less than 1MB");
      return;
    }

    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateAvatar(imageUrl);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <Avatar className="h-24 w-24 shadow-md ring-4 ring-slate-50">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
          {user.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2 text-center sm:text-left">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleClick}
        >
          Change Avatar
        </Button>
        <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload avatar"
      />
    </div>
  );
}
