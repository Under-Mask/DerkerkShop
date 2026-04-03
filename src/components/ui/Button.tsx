"use client";

import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full border px-4 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "sm" ? "h-9 text-sm" : "h-11 text-sm",
        variant === "primary" &&
          "border-white bg-white text-black hover:bg-zinc-200 active:bg-zinc-300",
        variant === "ghost" &&
          "border-border bg-transparent text-foreground hover:bg-white/10 active:bg-white/15",
        props.disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

