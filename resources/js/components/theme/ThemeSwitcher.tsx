// By Sujal
import { Moon, Sun, SunMoon } from 'lucide-react'
import "./ThemeSwitcher.css"

import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme()
    const themeIcon = () => {
        switch (theme) {
            case 'dark':
                return <Moon className="h-[1.2rem] w-[1.2rem]" />
            case 'light':
                return <Sun className="h-[1.2rem] w-[1.2rem]" />
            default:
                return <SunMoon className="h-[1.2rem] w-[1.2rem]" />
        }
    }

    const handleThemeSwitch = () => {
        switch (theme) {
            case 'light':
                setTheme('dark')
                break
            case 'dark':
                setTheme('system')
                break
            default:
                setTheme('light')
                break
        }
    }

    const button = `inline-flex items-center justify-center whitespace-nowrap rounded-2xl cursor-pointer
        text-sm font-medium ring-offset-background transition-colors`
    const position = 'fixed bottom-5 right-5 z-50'
    const size = 'h-10 p-0'
    const variant = 'border border-muted bg-background hover:bg-muted hover:text-accent-foreground'

    return (
        <>
            {theme && (
                <div
                    className={cn(
                        'transition-[scale]',
                        button,
                        position,
                        size,
                        variant
                    )}
                    onClick={handleThemeSwitch}
                >
                    <div className="theme-switch-container">
                        <span className="theme-switch-icon">{themeIcon()}</span>
                        <span className="theme-switch-content">{theme}</span>
                    </div>
                </div>
            )}
        </>
    )
}
