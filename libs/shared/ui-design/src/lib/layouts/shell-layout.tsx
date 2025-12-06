
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  Bot
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { AIChatPanel } from '../components/ai/ai-chat-panel';

interface ShellLayoutProps {
  links?: { name: string; href: string; icon: any }[];
  user?: { name: string; email: string; avatarUrl?: string };
  onLogout?: () => void;
}

export function ShellLayout({ 
  links = [], 
  user = { name: 'User', email: 'user@example.com' },
  onLogout 
}: ShellLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background px-6 shadow-sm">
        <div className="flex items-center gap-4 w-64">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="shrink-0"
           >
             <Menu className="h-5 w-5" />
           </Button>
           <span className="text-xl font-bold tracking-tight text-primary">All-ERP</span>
        </div>

        <div className="flex flex-1 items-center justify-between ml-4">
           {/* Global Search */}
           <div className="relative w-96 hidden md:block">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               type="search" 
               placeholder="Search..." 
               className="w-full pl-9 bg-muted/50"
             />
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-4">
             {/* AI Toggle */}
             <Button 
               variant={isAiPanelOpen ? "secondary" : "ghost"}
               size="icon"
               onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
               title="AI Assistant"
             >
               <Bot className={`h-5 w-5 ${isAiPanelOpen ? 'text-primary' : ''}`} />
             </Button>

             <Button variant="ghost" size="icon">
               <Bell className="h-5 w-5" />
             </Button>
             
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={user.avatarUrl} alt={user.name} />
                     <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">{user.name}</p>
                     <p className="text-xs leading-none text-muted-foreground">
                       {user.email}
                     </p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem>
                   <Users className="mr-2 h-4 w-4" />
                   <span>Profile</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                   <Settings className="mr-2 h-4 w-4" />
                   <span>Settings</span>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Log out</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`
            border-r border-border bg-muted/30 transition-all duration-300 ease-in-out overflow-y-auto
            ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0'}
          `}
        >
          <nav className="flex flex-col gap-2 p-4">
             {links.map((link) => (
               <NavLink
                 key={link.href}
                 to={link.href}
                 className={({ isActive }) => `
                   flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                   ${isActive 
                     ? 'bg-primary text-primary-foreground shadow-sm' 
                     : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                   }
                 `}
               >
                 <link.icon className="h-4 w-4" />
                 {link.name}
               </NavLink>
             ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 transition-all duration-300">
          <Outlet />
        </main>

        {/* AI Panel (Right Side) */}
        <aside 
          className={`
            border-l border-border bg-background transition-all duration-300 ease-in-out
            ${isAiPanelOpen ? 'w-[400px]' : 'w-0 opacity-0 overflow-hidden'}
          `}
        >
          {isAiPanelOpen && (
            <AIChatPanel onClose={() => setIsAiPanelOpen(false)} />
          )}
        </aside>
      </div>
    </div>
  );
}
