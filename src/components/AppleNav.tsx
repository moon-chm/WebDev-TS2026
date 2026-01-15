import { useState } from "react"
import { Home, Calendar, Users, Code } from "lucide-react"

const desktopItems = [
  { label: "Events", id: "events" },
  { label: "Sponsors", id: "sponsors" },
  { label: "Developers", id: "developers" },
  { label: "Register", id: "register" },
]

const mobileItems = [
  { label: "Home", icon: Home, id: "home" },
  { label: "Events", icon: Calendar, id: "events" },
  { label: "Sponsors", icon: Users, id: "sponsors" },
  { label: "Devs", icon: Code, id: "developers" },
]

export function AppleLiquidGlassNav() {
  const [activeMobile, setActiveMobile] = useState(0)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
      {/* ================= Desktop ================= */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[65%]">
        <div className="w-full flex items-center justify-between px-6 py-3.5 rounded-full apple-glass">
          <span className="text-[15px] font-semibold tracking-tight text-white/95">
            TECH SYMPOSIUM 2026
          </span>

          <div className="flex items-center gap-8">
            {desktopItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="
                  text-[15px] font-semibold tracking-tight
                  text-white/60 hover:text-white/90
                  transition-all duration-300
                "
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ================= Mobile Top Pill ================= */}
      <nav className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%]">
        <div className="w-full flex items-center justify-between px-6 py-3 rounded-full apple-glass">
          <span className="text-[13px] font-semibold text-white/85">
            TECH SYMPOSIUM 2026
          </span>
          <span className="text-[13px] font-semibold text-white/50">
            {mobileItems[activeMobile].label}
          </span>
        </div>
      </nav>

      {/* ================= Mobile Bottom Dock ================= */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[85%] max-w-sm">
        <div className="w-full flex items-center justify-around px-3 py-2 rounded-full apple-glass">
          {mobileItems.map((item, index) => {
            const Icon = item.icon
            const isActive = index === activeMobile

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMobile(index)
                  scrollTo(item.id)
                }}
                className={`
                  relative p-3 rounded-full
                  transition-all duration-300
                  ${isActive ? "text-white" : "text-white/50"}
                  active:scale-95
                `}
              >
                <Icon size={18} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-white/60 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
