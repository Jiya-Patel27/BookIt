import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import BackButton from "../components/BackButton";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks (must all be at top level)
  const [exp, setExp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Fetch experience
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/experiences/${id}`)
      .then((res) => {
        setExp(res.data);
        setSelectedDate(null);
        setSelectedSlotId(null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!exp) return <div className="p-6 text-gray-500">Experience not found.</div>;

  // ✅ Derived values
  const selectedDay = exp.dates.find((d: any) => d.date === selectedDate);
  const selectedSlot = selectedDay?.slots.find((s: any) => String(s._id) === String(selectedSlotId));

  const subtotal = exp.price * quantity;
  const total = subtotal + exp.tax;

  // ✅ Handle quantity increase/decrease
  const handleQuantityChange = (change: number) => {
    if (!selectedSlot) {
      setMessage('Select a time slot first.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const newQty = quantity + change;
    if (newQty < 1) return;

    if (newQty > selectedSlot.remaining) {
      setMessage(`Only ${selectedSlot.remaining} seats available.`);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setQuantity(newQty);
  };

  // ✅ Handle confirm click
  const handleConfirm = () => {
    if (!selectedDate || !selectedSlotId) {
      setMessage('Please select a date and time slot.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    navigate('/checkout', {
      state: {
        experience: exp,
        slotId: selectedSlotId,
        quantity,
      },
    });
  };

  return (
    <>
      <BackButton label='Details'/>
      <div className="mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2">
          <img
            src={exp.image}
          alt={exp.title}
          className="w-[765px] h-[381px] object-cover rounded-xl mb-6"
        />

        <h2 className="text-[24px] font-semibold mb-4">{exp.title}</h2>
        <p className="text-[#6C6C6C] text-[16px] mb-8">{exp.description}</p>

        {/* Choose Date */}
        <h3 className="font-semibold text-[18px] mb-3">Choose date</h3>
        <div className="flex gap-4 mb-4 flex-wrap">
          {exp.dates.map((d: any) => (
            <button
              key={d.date}
              onClick={() => {
                setSelectedDate(d.date);
                setSelectedSlotId(null);
                setQuantity(1);
              }}
              className={`px-3 py-2 w-[69px] h-[34px] rounded-sm text-sm ${
                selectedDate === d.date
                  ? 'bg-[#FFD643] text-black'
                  : 'bg-gray-100 text-[#838383] hover:bg-yellow-200'
              }`}
            >
              {d.date}
            </button>
          ))}
        </div>

        {/* Choose Time */}
        {selectedDate && (
          <>
            <h3 className="font-semibold mb-2">Choose time</h3>
            <div className="flex flex-wrap flex-col gap-3 mb-6">
              <div>
              {selectedDay?.slots.map((s: any) => (
                <button
                  key={s._id}
                  disabled={s.remaining <= 0}
                  onClick={() => {
                    setSelectedSlotId(s._id);
                    setQuantity(1);
                    setMessage(null);
                  }}
                  className={` py-2 rounded-sm text-sm w-[117px] h-[34px] ${
                    selectedSlotId === s._id
                      ? 'bg-[#FFD643] text-black'
                      : 'bg-gray-100 text-[#838383] hover:bg-yellow-200'
                  } ${s.remaining <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {s.time}{' '}
                  {s.remaining <= 0 ? (
                    <span className="text-[#6A6A6A] text-[10px] ml-1">Sold out</span>
                  ) : (
                    <span className="text-red-500 text-[10px] ml-1">{s.remaining} left</span>
                  )}
                </button>
              ))}
              </div>
              <p className="text-[12px] text-[#838383]">All times are in IST (GMT +5:30)</p>
            </div>
          </>
        )}

        {/* About */}
        <div>
          <h3 className="font-semibold  text-[18px] mb-1">About</h3>
          <p className="text-[#6C6C6C] text-sm bg-gray-100 p-2 rounded-md">
            {exp.about}
          </p>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className=" p-5 bg-gray-50 h-fit">
        <div className="flex justify-between text-[16px] text-[#656565] mb-2">
          <span>Starts at</span>
          <span className='text-black text-[18px]'>₹{exp.price}</span>
        </div>

        <div className="flex justify-between text-[16px] text-[#656565] mb-3 items-center">
          <span>Quantity</span>
          <div className="flex items-center gap-2">
            <button
              className="bold border-[0.4px] border-[#C9C9C9] w-4 h-4 flex justify-center items-center"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="text-black text-[12px]">{quantity}</span>
            <button
              className="bold border-[0.4px] border-[#C9C9C9] w-4 h-4 flex justify-center items-center"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </div>

        {message && <div className="text-sm text-red-600 mb-3">{message}</div>}

        <div className="flex justify-between text-[16px] text-[#656565] mb-2">
          <span>Subtotal</span>
          <span className='text-[14px] text-black'>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-[16px] text-[#656565] mb-2">
          <span>Taxes</span>
          <span className='text-[14px] text-black'>₹{exp.tax}</span>
        </div>

        <hr className="my-2 w-[339px] h-px text-[#D9D9D9]  " />

        <div className="flex justify-between font-semibold text-[20px] mb-4">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedSlotId}
          className={`py-2 rounded-lg w-[290px] h-11 gap-2.5 font-semibold ${
            selectedDate && selectedSlotId
              ? 'bg-[#FFD643] hover:bg-[#f8cb27] text-black'
              : 'bg-[#D7D7D7] cursor-not-allowed text-[#7F7F7F] '
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
    </>
  );
}

