import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function TypographyH1({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-text-secondary dark:text-text-primary border-none",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p
      className={cn(
        "leading-7 text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyBlockquote({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyTable({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <div className="my-6 w-full overflow-y-auto text-text-secondary dark:text-text-primary">
      <table className={cn("w-full", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TypographyList({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <ul
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2 text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function TypographyInlineCode({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function TypographyLead({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-xl text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyLarge({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <div
      className={cn(
        "text-lg font-semibold text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TypographySmall({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <small
      className={cn(
        "text-sm font-medium leading-none text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </small>
  );
}

export function TypographyExtraSmall({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <small
      className={cn(
        "text-xs font-medium leading-none text-text-secondary dark:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </small>
  );
}

export function TypographyMuted({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      {children}
    </p>
  );
}
