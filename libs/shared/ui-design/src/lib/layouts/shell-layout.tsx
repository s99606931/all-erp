
import * as React from "react"
import { Outlet, NavLink } from "react-router-dom"
import { cn } from "../utils"
import { Button } from "../components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links: { name: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}

export function Sidebar({ className, links }: SidebarProps) {
  return (
    <div className={cn("pb-12 h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            All-ERP
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                 key={link.href}
                 to={link.href}
                 className={({ isActive }) => cn(
                   "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                   isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                 )}
              >
                 {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                 {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface HeaderProps {
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
      <div className="w-full flex-1">
        {/* Breadcrumbs or Search could go here */}
      </div>
      <div className="flex items-center gap-4">
         <span className="text-sm text-muted-foreground">{user?.name || 'Guest'}</span>
         <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
      </div>
    </header>
  )
}

interface ShellLayoutProps {
  links: { name: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export function ShellLayout({ links, user, onLogout }: ShellLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
       <div className="hidden border-r bg-muted/40 lg:block">
         <Sidebar links={links} />
       </div>
       <div className="flex flex-col">
         <Header user={user} onLogout={onLogout} />
         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           <Outlet />
         </main>
       </div>
    </div>
  )
}
