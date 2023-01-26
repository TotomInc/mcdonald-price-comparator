"use client";

export function PaginationButton({
  children,
  ...buttonProps
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center bg-transparent disabled:opacity-50"
      {...buttonProps}
    >
      {children}
    </button>
  );
}
