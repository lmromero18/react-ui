"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { menuItems } from "@/lib/menu-items";
import { ChevronUp, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function AppSidebar() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar collapsible="icon" className={`transition-all duration-300 ${isExpanded ? "w-64" : "w-24"}`}>
      <SidebarContent>
        <TooltipProvider>
          {menuItems.map((groupOrItem, index) => {
            if ("group" in groupOrItem) {
              return (
                <SidebarGroup key={groupOrItem.label}>
                  <SidebarGroupLabel className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                    {groupOrItem.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {groupOrItem.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <SidebarMenuItem key={item.label}>
                            {/* 🔹 Agregamos Tooltip solo si el Sidebar está colapsado */}
                            {!isExpanded ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton asChild>
                                    <a href={item.href} className="flex items-center justify-center">
                                      <Icon className="w-6 h-6 flex-shrink-0" />
                                    </a>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.label}</TooltipContent>
                              </Tooltip>
                            ) : (
                              <SidebarMenuButton asChild>
                                <a href={item.href} className="flex items-center">
                                  <Icon className="w-6 h-6 flex-shrink-0" />
                                  <span className={`ml-3 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                                    {item.label}
                                  </span>
                                </a>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            }
          })}

          {/* 🔹 Envolver elementos individuales en un SidebarMenu con Tooltip */}
          <SidebarMenu>
            {menuItems
              .filter((item: any) => !("group" in item))
              .map((item: any) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.label}>
                    {!isExpanded ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <a
                              href={item.href}
                              className={`flex items-center transition-all duration-300 ${isExpanded ? "justify-start" : "ms-2 justify-start"
                                }`}
                            >
                              <Icon className="w-6 h-6 flex-shrink-0" />
                              <span
                                className={`ml-3 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                                  }`}
                              >
                                {item.label}
                              </span>
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={item.href} className="flex items-center">
                          <Icon className="w-6 h-6 flex-shrink-0" />
                          <span className={`ml-3 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                            {item.label}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>

      {/* 🔹 Footer con Dropdown y Tooltip */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 /> {isExpanded && "Username"}
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
