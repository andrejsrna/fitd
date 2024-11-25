// components/ui/pagination.tsx

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

// 1. Definovanie hlavného komponentu Pagination
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

// 2. Definovanie PaginationContent
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

// 3. Definovanie PaginationItem
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// 4. Definovanie PaginationLink
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

// 5. Definovanie rozhrania pre PaginationPrevious a PaginationNext
interface PaginationButtonProps extends Omit<PaginationLinkProps, "isActive"> {
  inactive?: boolean;
}

// 6. Definovanie PaginationPrevious
const PaginationPrevious: React.FC<PaginationButtonProps> = ({
  inactive = false,
  className,
  href,
  ...props
}) => {
  if (inactive) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "gap-1 pl-2.5 cursor-not-allowed opacity-50",
          className
        )}
        aria-disabled="true"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Naspäť</span>
      </span>
    );
  }

  return (
    <PaginationLink
      href={href}
      className={cn("gap-1 pl-2.5", className)}
      size="default"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Naspäť</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

// 7. Definovanie PaginationNext
const PaginationNext: React.FC<PaginationButtonProps> = ({
  inactive = false,
  className,
  href,
  ...props
}) => {
  if (inactive) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "gap-1 pr-2.5 cursor-not-allowed opacity-50",
          className
        )}
        aria-disabled="true"
      >
        <span>Ďalej</span>
        <ChevronRight className="h-4 w-4" />
      </span>
    );
  }

  return (
    <PaginationLink
      href={href}
      className={cn("gap-1 pr-2.5", className)}
      size="default"
      {...props}
    >
      <span>Ďalej</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

// 8. Definovanie PaginationEllipsis
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Viac stránok</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
