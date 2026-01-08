import Link from "next/link"
import { Button } from "./ui/button"
import { Camera } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-full sticker">
            <Camera className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">4cats.camera</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/rental" className="text-sm font-medium hover:text-primary transition-colors">Rental</Link>
          <Link href="/order-camera" className="text-sm font-medium hover:text-primary transition-colors">Order Service</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">Login</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  )
}
