import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth/');
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900 flex flex-col">
      {!isAuthPage && <Navigation />}
      <main className="flex-1 w-full">{children}</main>
      {!isAuthPage &&
      <footer className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Care@Home Tunisia
                </h3>
                <p className="text-gray-600 max-w-xs">
                  La première plateforme de soins à domicile en Tunisie.
                  Connectez-vous avec des professionnels de santé qualifiés en
                  toute confiance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>Soins infirmiers</li>
                  <li>Assistance personnes âgées</li>
                  <li>Kinésithérapie</li>
                  <li>Garde malade</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>Tunis, Tunisie</li>
                  <li>support@carehome.tn</li>
                  <li>+216 71 000 000</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Care@Home Tunisia. Tous droits
              réservés.
            </div>
          </div>
        </footer>
      }
    </div>);

}