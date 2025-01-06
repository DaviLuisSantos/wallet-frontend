import { FaHome, FaWallet, FaChartLine, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(router.pathname);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

    const handleLinkClick = (href) => {
        setActiveLink(href);
        if (isCollapsed) {
            setIsCollapsed(false);
        }
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Botão do menu para telas pequenas */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-40 text-white focus:outline-none lg:hidden"
                aria-label="Toggle navigation"
            >
                {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>

            <div
                className={`h-screen bg-gray-800 text-white fixed top-0 left-0 border-r border-gray-700 flex flex-col transition-all duration-300 z-30
                    ${isCollapsed ? 'w-16' : 'w-64'}
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:w-64 lg:flex
                `}
            >
                <div className="flex items-center justify-between p-4">
                    {!isCollapsed && <div className="text-2xl font-bold text-center lg:block hidden">Crypto Manager</div>}
                    <button onClick={toggleCollapse} className="focus:outline-none lg:hidden block">
                        {isCollapsed ? <FaBars className="text-xl text-white" /> : <FaTimes className="text-xl text-white" />}
                    </button>
                </div>
                <ul className="space-y-2 flex-1">
                    <li
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${
                            activeLink === '/dashboard' ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => handleLinkClick('/dashboard')}
                    >
                        <div className="flex items-center">
                            <FaHome className={`mr-3 text-xl ${activeLink === '/dashboard' ? 'text-white' : 'text-gray-400'}`} />
                            {!isCollapsed && (
                                <Link href="/dashboard" className="select-none">
                                    <span>Dashboard</span>
                                </Link>
                            )}
                        </div>
                        {isCollapsed && (
                            <span className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-md z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Dashboard
                            </span>
                        )}
                    </li>
                    <li
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${
                            activeLink === '/wallets' ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => handleLinkClick('/wallets')}
                    >
                        <div className="flex items-center">
                            <FaWallet className={`mr-3 text-xl ${activeLink === '/wallets' ? 'text-white' : 'text-gray-400'}`} />
                            {!isCollapsed && (
                                <Link href="/wallets" className="select-none">
                                    <span>Wallet</span>
                                </Link>
                            )}
                        </div>
                        {isCollapsed && (
                            <span className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-md z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Wallet
                            </span>
                        )}
                    </li>
                    <li
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${
                            activeLink === '/services' ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => handleLinkClick('/services')}
                    >
                        <div className="flex items-center">
                            <FaChartLine className={`mr-3 text-xl ${activeLink === '/services' ? 'text-white' : 'text-gray-400'}`} />
                            {!isCollapsed && (
                                <Link href="/services" className="select-none">
                                    <span>Monitor</span>
                                </Link>
                            )}
                        </div>
                        {isCollapsed && (
                            <span className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-md z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Monitor
                            </span>
                        )}
                    </li>
                    <li
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${
                            activeLink === '/contact' ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => handleLinkClick('/contact')}
                    >
                        <div className="flex items-center">
                            <FaHistory className={`mr-3 text-xl ${activeLink === '/contact' ? 'text-white' : 'text-gray-400'}`} />
                            {!isCollapsed && (
                                <Link href="/contact" className="select-none">
                                    <span>History</span>
                                </Link>
                            )}
                        </div>
                        {isCollapsed && (
                            <span className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-md z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                History
                            </span>
                        )}
                    </li>
                </ul>
                <div className="mt-auto text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Crypto Manager
                </div>
            </div>
        </>
    );
}