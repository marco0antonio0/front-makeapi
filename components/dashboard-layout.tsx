"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Plus, Database, Settings, Code2, Menu, X, Bell, Search } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { session, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 relative">
      <div className="absolute inset-0 pattern-dots opacity-30"></div>

      <header className="sticky top-0 z-50 glass-effect border-b border-border/50 shadow-lg backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="flex items-center space-x-3 sm:space-x-4 hover:opacity-80 transition-all duration-200 group"
            >
              <div className="gradient-bg rounded-xl p-2 sm:p-3 shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 relative overflow-hidden">
                <Code2 className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground relative z-10" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Make API
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Gerenciador de APIs</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          {/* <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar endpoints..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                />
              </div> */}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-muted/50"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            <nav className="hidden md:flex items-center space-x-1 bg-muted/50 rounded-xl p-1 backdrop-blur-sm border border-border/30">
              <Link
                href="/home"
                className={`flex items-center space-x-2 px-4 lg:px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === "/home"
                    ? "bg-card text-primary shadow-md transform scale-105 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50 hover:scale-105"
                }`}
              >
                <Database className="h-4 w-4" />
                <span className="hidden lg:inline">Endpoints</span>
              </Link>
              <Link
                href="/create"
                className={`flex items-center space-x-2 px-4 lg:px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === "/create"
                    ? "bg-card text-primary shadow-md transform scale-105 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50 hover:scale-105"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Criar</span>
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-muted/50 rounded-lg">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center">
                  <span className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-pulse"></span>
                </span>
              </Button>

              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-foreground truncate max-w-32">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-32">{session?.user.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-primary/20"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="gradient-bg text-primary-foreground font-semibold text-sm">
                        {session?.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 sm:w-64 animate-scale-in glass-effect border-border/50"
                  align="end"
                >
                  <div className="flex items-center justify-start gap-3 p-4 bg-muted/30 rounded-t-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="gradient-bg text-primary-foreground text-lg">
                        {session?.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-sm">{session?.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session?.user.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer hover:bg-destructive/10 p-3"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 glass-effect animate-slide-up">
            <div className="container mx-auto px-4 py-4">
              {/* Busca mobile */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar endpoints..."
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === "/home"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Database className="h-5 w-5" />
                  <span>Endpoints</span>
                </Link>
                <Link
                  href="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === "/create"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Criar</span>
                </Link>

                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="gradient-bg text-primary-foreground text-sm">
                        {session?.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{session?.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session?.user.email}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto mt-2"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in relative z-10">{children}</main>
    </div>
  )
}
