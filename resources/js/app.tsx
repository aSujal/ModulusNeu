import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Components/theme/ThemeProvider';
import { ThemeSwitch } from './Components/theme/ThemeSwitcher';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const WrappedApp = (
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <ThemeSwitch />
                <Toaster/>
                <App {...props} />
            </ThemeProvider>
        );
        const root = createRoot(el);

        root.render(WrappedApp); 
    },
    progress: {
        color: '#4B5563',
    },
});
