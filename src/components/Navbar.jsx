import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(router.pathname);

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);


  const handleLinkClick = (href) => {
    setActiveLink(href);
     setIsMenuOpen(false)
  };

    return (
        <nav className="bg-gray-800 p-4 border-b border-gray-700 relative">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/" className="select-none">
                            CryptoDashboard
                    </Link>
                </div>

                  {/* Ícone de menu para dispositivos móveis */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white lg:hidden focus:outline-none"
                    aria-label="Toggle navigation"
                >
                   {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </button>

                <div
                 className={`
                    ${isMenuOpen ? 'flex flex-col mt-4 space-y-2 absolute bg-gray-800 top-full left-0 w-full p-4 border-t border-gray-700 z-20' : 'hidden lg:flex space-x-4'}
                   lg:space-x-4 lg:mt-0 lg:relative lg:flex lg:items-center transition-all duration-300
                `}
                >
                    <Link href="/" className={`select-none px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === '/' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => handleLinkClick('/')}>
                         Home
                    </Link>
                    <Link href="/portfolio" className={`select-none px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === '/portfolio' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => handleLinkClick('/portfolio')}>
                        Portfolio
                    </Link>
                    <Link href="/market" className={`select-none px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === '/market' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => handleLinkClick('/market')}>
                        Market
                    </Link>
                    <Link href="/transactions" className={`select-none px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === '/transactions' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => handleLinkClick('/transactions')}>
                        Transactions
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;