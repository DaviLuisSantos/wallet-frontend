import Sidebar from '../components/Sidebar';
import '../app/globals.css';
import { CryptocurrenciesProvider } from '../context/CryptocurrenciesContext';
import { WalletProvider } from '../context/WalletContext';
import { PricesProvider } from '../context/PricesContext';

function MyApp({ Component, pageProps }) {
  return (

    <CryptocurrenciesProvider>
      <WalletProvider>
        <PricesProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
              {/* Page Content */}
              <main className="flex-1 overflow-y-auto">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </PricesProvider>
      </WalletProvider>
    </CryptocurrenciesProvider>
  );
}

export default MyApp;