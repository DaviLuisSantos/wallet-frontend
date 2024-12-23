import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../app/globals.css';
import { CryptocurrenciesProvider } from '../context/CryptocurrenciesContext';
import { WalletProvider } from '../context/WalletContext';
import { PricesProvider } from '../context/PricesContext';

function MyApp({ Component, pageProps }) {
  return (
    <CryptocurrenciesProvider>
      <WalletProvider>
        <PricesProvider>
          <div className="flex flex-col h-screen">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
              {/* Sidebar */}
              <Sidebar />

              {/* Conteúdo Principal */}
              <main className="flex-1 p-6 ml-64 mt-16">
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