import { FaHome, FaWallet, FaChartLine, FaHistory } from 'react-icons/fa';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="h-full w-64 text-white fixed top-16 left-0 p-4 border-r border-gray-700">
      <div className="text-2xl font-bold mb-6">Crypto Manager</div>
      <ul className="space-y-4">
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-lg">
          <FaHome className="mr-3" />
          <Link href="/dashboard">
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-lg">
          <FaWallet className="mr-3" />
          <Link href="/wallets">
            <span>Wallet</span>
          </Link>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-lg">
          <FaChartLine className="mr-3" />
          <Link href="/services">
            <span>Monitor</span>
          </Link>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-lg">
          <FaHistory className="mr-3" />
          <Link href="/contact">
            <span>History</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}