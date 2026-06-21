import './globals.css';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'ReSell Hub - Second-Hand Marketplace Platform',
  description: 'A complete marketplace platform to securely list, trade and buy pre-owned products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </body>
    </html>
  );
}
