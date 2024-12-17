import Sidebar from '../components/Sidebar';
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 ml-64">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;