import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../app/globals.css';
import { CryptocurrenciesProvider } from '../context/CryptocurrenciesContext';
import { WalletProvider } from '../context/WalletContext';
import { PricesProvider } from '../context/PricesContext';

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <CryptocurrenciesProvider>
        <PricesProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
              <Sidebar />
            </aside>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </PricesProvider>
      </CryptocurrenciesProvider>
    </WalletProvider>
  );
}

export default MyApp;
