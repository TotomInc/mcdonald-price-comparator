"use client";

export function PaginationButton({
  children,
  ...buttonProps
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-transparent disabled:opacity-50"
      {...buttonProps}
    >
      {children}
    </button>
  );
}
