import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import StatifyLogo from './StatifyLogo'; // Added StatifyLogo import
import { 
  BarChart2, 
  Users, 
  Music, 
  ListMusic,
  Sparkles 
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart2 },
  { href: "/artists", label: "Top Artists", icon: Users },
  { href: "/songs", label: "Song Analysis", icon: Music },
  { href: "/playlists", label: "Your Playlists", icon: ListMusic },
  { href: "/recommendations", label: "For You", icon: Sparkles },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 fixed h-full">
        <Link href="/">
          <div className="flex items-center gap-2 mb-10 cursor-pointer">
            <StatifyLogo />
          </div>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-purple-900/50",
                  location === item.href 
                    ? "bg-gradient-to-r from-[#1DB954] to-purple-600 text-white" 
                    : "text-gray-400"
                )}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full">
        {children}
      </div>
    </div>
  );
}