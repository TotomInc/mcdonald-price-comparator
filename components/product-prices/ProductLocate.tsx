"use client";

import { LocateFixed } from "lucide-react";
import cn from "classnames";

type ProductLocateProps = {
  setCoords: React.Dispatch<React.SetStateAction<[number, number]>>;
  disabled: boolean;
  isActive: boolean;
};

export function ProductLocate({
  setCoords,
  disabled,
  isActive,
}: ProductLocateProps) {
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
      });
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-auto items-center justify-center rounded-md border border-slate-700 px-3 disabled:opacity-50",
        {
          "border-indigo-500 bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-500 text-white":
            isActive,
        }
      )}
      disabled={disabled}
      onClick={handleGeolocation}
    >
      <LocateFixed />
      <span className="sr-only">Find restaurant near-me</span>
    </button>
  );
}
