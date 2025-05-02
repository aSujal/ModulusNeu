import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground px-6 py-8">
      
      <header className="flex justify-between items-center w-full mb-12">
  {/* Logo-Text */}
  <div className="text-2xl font-bold text-wihte">
    Modulus
    <i className="fa-solid fa-graduation-cap text-green-600 text-2xl"></i>
  </div>

  {/* Rechts: Auth Links + Icon */}
  <div className="flex items-center space-x-4">
    <nav className="space-x-6 text-lg text-gray-700">
      {auth.user ? (
        <Link
          href={route('dashboard')}
          className="text-blue-600 hover:text-blue-800 transition text-lg"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            href={route('login')}
            className="text-blue-600 hover:text-blue-800 transition text-lg"
          >
            Log in
          </Link>
          <Link
            href={route('register')}
            className="text-blue-600 hover:text-blue-800 transition text-lg"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  

  </div>
</header>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto">
            
            {/* Text Content */}
            <div className="lg:w-1/2">
                <h2 className="text-green-400 text-lg mb-2">Modulus</h2>
                <h1 className="text-5xl font-extrabold text-green-500 mb-4">
                    Willkommen zu unserer Lernplattform.
                </h1>
                <p className="text-lg text-gray-500 mb-6">
                    MODULUS hilft dir, Wissen aufzubauen und in deinem Tempo zu wachsen. Ob Technik, Design oder Business – wir begleiten dich.
                </p>
                <Button className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 text-lg rounded">
                    Sign up
                </Button>
            </div>

            {/* Illustration */}    
            <div className="lg:w-5/2">
                <img 
                    src="./images/landing-graphic.png" 
                    alt="Illustration" 
                    className="w-full h-auto"
                    onError={handleImageError}
                />
            </div>
        </section>

        {/* Footer with Team */}
        <footer className="text-center mt-20 text-gray-500 text-sm">
            <p className="mb-1">
                <span className="text-gray-700 font-semibold">Mitgewirkt:</span> Victory · Sujal · Basit · Alirazer
            </p>
            <p className="text-xs text-gray-600">Powered by ibisacam</p>
        </footer>
    </main>
      )
}
