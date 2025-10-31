import { useState } from 'react';
import logo from '../../public/logo.png';

export default function Header() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch a custom event to notify Home component
    window.dispatchEvent(new CustomEvent('search', { detail: query.trim() }));
  };

  return (
    <header className="bg-white shadow-sm">
      <div className=" mx-[10%] px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-[55px] w-[100px]" />
          {/* <div>
            <div className="text-[14px] font-semibold leading-tight">highway</div>
            <div className="text-[12px] text-gray-500 -mt-1">delite</div>
          </div> */}
        </div>

        {/* Right: Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-[443px] h-[42px] text-[14px] max-w-xs sm:max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search experiences..."
            className="flex-1 px-4 py-2 bg-[#EDEDED] text-[#727272] rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-[#FFD643] hover:bg-[#f8cb27] text-black font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
