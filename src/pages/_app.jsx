import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;