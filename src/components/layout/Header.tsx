import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { UserNav } from './UserNav';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 py-4 px-6 backdrop-blur-sm md:px-10 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">ANSSI</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
};