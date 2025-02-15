import { HelpCircle, Home, Settings, User, Folder, Bell, LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface MenuGroup {
  group: true;
  label: string;
  items: MenuItem[];
}

// El array puede contener tanto grupos como elementos individuales
export const menuItems: (MenuGroup | MenuItem)[] = [
  {
    group: true,
    label: "Main",
    items: [
      { icon: Home, label: "Home", href: "/" },
      { icon: User, label: "Profile", href: "/profile" },
    ],
  },
  {
    group: true,
    label: "Settings",
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: HelpCircle, label: "Help", href: "/help" },
    ],
  },
  { icon: Folder, label: "Projects", href: "/projects" }, // Elemento individual
  { icon: Bell, label: "Notifications", href: "/notifications" }, // Elemento individual
];
