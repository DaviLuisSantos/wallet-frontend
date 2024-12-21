import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className=" p-4 border-b border-gray-700">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link legacyBehavior href="/">
                        <a>CryptoDashboard</a>
                    </Link>
                </div>
                <div className="space-x-4">
                    <Link legacyBehavior href="/">
                        <a className="text-gray-300 hover:text-white">Home</a>
                    </Link>
                    <Link legacyBehavior href="/portfolio">
                        <a className="text-gray-300 hover:text-white">Portfolio</a>
                    </Link>
                    <Link legacyBehavior href="/market">
                        <a className="text-gray-300 hover:text-white">Market</a>
                    </Link>
                    <Link legacyBehavior href="/transactions">
                        <a className="text-gray-300 hover:text-white">Transactions</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;