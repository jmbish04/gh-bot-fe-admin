import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/research", label: "Research" },
  { href: "/admin/commands", label: "Commands" },
  { href: "/admin/practices", label: "Best Practices" },
  { href: "/admin/operations", label: "Operations" },
];

export function Header({ currentPath }: { currentPath: string }) {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6 h-16">
      <a href="/" className="text-sm font-bold leading-none text-foreground">
        GH BOT Admin
      </a>
      {links.map((link) => (
        <a
          key={link.href}
          className={cn(
            "text-sm font-medium leading-none text-foreground",
            currentPath === link.href
              ? "text-foreground"
              : "text-muted-foreground",
          )}
          href={link.href}
          aria-current={currentPath === link.href ? "page" : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
