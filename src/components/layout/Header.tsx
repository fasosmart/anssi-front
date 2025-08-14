import Link from 'next/link';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  return (
    <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b bg-card">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">ANSSI</span>
      </Link>
      <div className="flex items-center gap-2">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/login" className="hover:text-primary transition-colors">
            Connexion
          </Link>
          <Button asChild>
            <Link href="/register">Créer un compte</Link>
          </Button>
        </nav>
        
        <ThemeToggle />

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Connexion</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">Créer un compte</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};