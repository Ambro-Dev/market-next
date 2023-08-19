"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const notSelected =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary";

const selected = "text-sm font-medium transition-colors hover:text-primary";

export function MainNav({
  subjectId,
  ...props
}: {
  subjectId: string | undefined;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/subjects") return null;

  return (
    <>
      <nav
        className={cn(
          "md:flex items-center space-x-4 lg:space-x-6 mx-6 md:visible hidden"
        )}
        {...props}
      >
        <Link
          href={`/admin/subjects/${subjectId}`}
          className={
            pathname === `/admin/subjects/${subjectId}` ? selected : notSelected
          }
        >
          Panel gówny
        </Link>
        <Link
          href={`/admin/subjects/${subjectId}/members`}
          className={
            pathname === `/admin/subjects/${subjectId}/members`
              ? selected
              : notSelected
          }
        >
          Użytkownicy
        </Link>
        <Link
          href={`/admin/subjects/${subjectId}/transports`}
          className={
            pathname === `/admin/subjects/${subjectId}/transports`
              ? selected
              : notSelected
          }
        >
          Transporty
        </Link>
        <Link
          href="/examples/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Ustawienia
        </Link>
      </nav>
      <nav
        className={cn(
          "flex items-center space-x-4 lg:space-x-6 mx-6 md:hidden visible"
        )}
        {...props}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/subjects/${subjectId}`}
                  className={
                    pathname === `/admin/subjects/${subjectId}`
                      ? selected
                      : notSelected
                  }
                >
                  Panel gówny
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/subjects/${subjectId}/members`}
                  className={
                    pathname === `/admin/subjects/${subjectId}/members`
                      ? selected
                      : notSelected
                  }
                >
                  Użytkownicy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/subjects/${subjectId}/transports`}
                  className={
                    pathname === `/admin/subjects/${subjectId}/transports`
                      ? selected
                      : notSelected
                  }
                >
                  Transporty
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/examples/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Ustawienia
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
