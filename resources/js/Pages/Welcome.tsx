import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button"

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
        <main className="flex flex-col bg-background px-6 py-8 min-h-screen text-foreground">
      
      <header className="flex justify-between items-center mb-12 w-full">
  {/* Logo-Text */}
  <div className="font-bold text-wihte text-2xl">
    Modulus
    <i className="text-green-600 text-2xl fa-solid fa-graduation-cap"></i>
  </div>

  {/* Rechts: Auth Links + Icon */}
  <div className="flex items-center space-x-4">
    <nav className="space-x-6 text-gray-700 text-lg">
      {auth.user ? (
        <Link
          href={route('dashboard')}
          className="text-green-600 hover:text-blue-800 text-lg transition"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            href={route('login')}
            className="text-green-600 hover:text-blue-800 text-lg transition"
          >
            Log in
          </Link>
          <Link
            href={route('register')}
            className="text-green-600 hover:text-blue-800 text-lg transition"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  

  </div>
</header>

        {/* Hero Section */}
        <section className="flex lg:flex-row flex-col-reverse flex-1 justify-between items-center gap-10 mx-auto max-w-6xl">
            
            {/* Text Content */}
            <div className="lg:w-1/2">
                <h2 className="mb-2 text-green-400 text-lg">Modulus</h2>
                <h1 className="mb-4 font-extrabold text-green-500 text-5xl">
                Willkommen auf unserer Lernplattform
                </h1>
                <p className="mb-6 text-gray-500 text-lg">
                MODULUS – Deine Plattform für Wissen und Wachstum. Lerne, entdecke und erreiche deine Ziele in deinem eigenen Tempo. Gemeinsam gestalten wir deine Zukunft.
                </p>
              
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
        <footer className="mt-20 text-gray-500 text-sm text-center">
            <p className="mb-1">
                <span className="font-semibold text-gray-700">Mitgewirkt:</span> Victory · Sujal · Basit · Alirazer
            </p>
            <p className="text-gray-600 text-xs">Powered by ibisacam</p>
        </footer>
    </main>
      )
}
