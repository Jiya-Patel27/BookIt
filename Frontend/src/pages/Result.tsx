import { useLocation, Link } from 'react-router-dom';

export default function Result() {
  const loc = useLocation();
  const state: any = loc.state || {};

  if (!state.success) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 text-center">
        <div className="bg-white rounded-xl shadow-sm p-10 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h2 className="text-[32px] font-semibold text-red-600 mb-2">Booking Failed</h2>
          <p className="text-[#656565] text-xl mb-6">
            {state.message || 'Unable to book slot. Please try again later.'}
          </p>

          <Link
            to="/"
            className="inline-block bg-[#E3E3E3] text-[#656565] px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 text-center">
      <div className="bg-white rounded-xl shadow-sm p-10 w-full max-w-md">
        {/* ✅ Green check icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* ✅ Booking details */}
        <h2 className="text-[32px] font-semibold mb-2">Booking Confirmed</h2>
        <p className="text-[#656565] text-xl mb-6">
          Ref ID: <span className="font-mono">{state.bookingId || 'N/A'}</span>
        </p>

        {/* {state.pricePaid && (
          <p className="text-gray-600 mb-8">
            Amount Paid: <span className="font-semibold">₹{state.pricePaid}</span>
          </p>
        )} */}

        <Link
          to="/"
          className="inline-block bg-[#E3E3E3] text-[#656565] px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
