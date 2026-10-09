"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, initials } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square size-full object-cover", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-gradient-to-br from-teach-soft to-learn-soft font-semibold text-foreground/70",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/** Avatar for a user record, with initials fallback. */
function UserAvatar({
  user,
  className,
  online,
}: {
  user: { name: string; avatar?: string };
  className?: string;
  online?: boolean;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar className={className}>
        {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
        <AvatarFallback className="text-[0.8em]">{initials(user.name)}</AvatarFallback>
      </Avatar>
      {online && (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-success" aria-label="Online" />
      )}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
