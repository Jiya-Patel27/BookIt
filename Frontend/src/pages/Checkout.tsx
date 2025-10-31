import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import BackButton from '../components/BackButton';

export default function Checkout() {
  const loc = useLocation();
  const nav = useNavigate();
  const state = (loc.state as any) || {};
  const experience = state.experience;
  const slotId = state.slotId;
  const initialQuantity = state.quantity ?? 1;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  const [promo, setPromo] = useState('');
  const [discounted, setDiscounted] = useState<number | null>(null);
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [msg, setMsg] = useState<string | null>(null);

  const [agreed, setAgreed] = useState(false);


  useEffect(() => {
    // If user directly opened checkout without required data, redirect home
    if (!experience || !slotId) {
      nav('/', { replace: true });
    }
  }, [experience, slotId]);

  // find selected slot object and remaining
  const selectedDay = experience?.dates?.find((d: any) =>
    d.slots.some((s: any) => String(s._id) === String(slotId))
  );

  const selectedSlot = selectedDay?.slots?.find((s: any) => String(s._id) === String(slotId));

  useEffect(() => {
    // clamp quantity to slot remaining when slot or initial quantity changes
    if (selectedSlot) {
      if (quantity > selectedSlot.remaining) {
        setQuantity(selectedSlot.remaining || 1);
        setMsg(`Quantity reduced to ${selectedSlot.remaining} because only that many seats are left.`);
        setTimeout(() => setMsg(null), 3000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlot]);

  if (!experience || !selectedSlot) {
    return <div className="py-6 p-4 text-gray-600">Missing booking info — please start from the details page.</div>;
  }

  const basePrice = selectedSlot.price ?? experience.price ?? 0; // in case price is in experience
  const subtotal = basePrice * quantity;
  const total = (discounted !== null ? discounted * quantity : subtotal) + (experience.tax ?? 0);

  async function checkPromo() {
    if (!promo) return setMsg('Enter promo code');
    setLoadingPromo(true);
    try {
      const res = await api.post('/promo/validate', { code: promo, price: basePrice });
      if (res.data.valid) {
        // server returned discounted price for single seat; multiply later by quantity
        setDiscounted(res.data.discounted);
        setMsg('Promo applied');
      } else {
        setDiscounted(null);
        setMsg('Invalid promo');
      }
    } catch (err) {
      console.error(err);
      setMsg('Promo check failed');
    } finally {
      setLoadingPromo(false);
      setTimeout(() => setMsg(null), 2500);
    }
  }

  async function submitBooking() {
    if (!name || !email) return setMsg('Name and email are required');
    if (quantity > selectedSlot.remaining) return setMsg('Not enough seats available for selected time');
    setBookingLoading(true);
    try {
      // backend expects single booking per seat in our earlier design, but we will send quantity
      // If backend doesn't accept quantity, you may need to call it multiple times or modify backend.
      const res = await api.post('/bookings', {
        experienceId: experience._id,
        slotId,
        name,
        email,
        // phone,
        promoCode: promo || null,
        quantity
      });

      if (res.data.success) {
        nav('/result', { state: { success: true, bookingId: res.data.bookingId, pricePaid: total } });
      } else {
        nav('/result', { state: { success: false, message: res.data.error || 'Booking failed' } });
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Booking failed';
      nav('/result', { state: { success: false, message } });
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <>
      <BackButton label='Checkout' />
      <div className="mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT: Form section */}
        <div className="bg-gray-50 p-8 rounded-xl shadow-sm md:col-span-2">

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='text-[14px] text-[#585858]'>Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-[#DDDDDD] placeholder-[#727272] text-sm rounded-md px-4 py-3 mt-2 focus:outline-none w-full h-[42px]"
                />
              </div>
              <div>
                <label className='text-[14px] text-[#585858]'>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="bg-[#DDDDDD] placeholder-[#727272] text-sm rounded-md px-4 py-3 mt-2 focus:outline-none w-full h-[42px]"
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-1">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="bg-gray-200 placeholder-gray-500 text-sm rounded-md px-4 py-3 focus:outline-none w-full"
        />
      </div> */}


            <div className="flex gap-3">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code"
                className="bg-[#DDDDDD] placeholder-[#727272] text-sm rounded-md px-4 py-3 flex-1 focus:outline-none"
              />
              <button
                onClick={checkPromo}
                disabled={loadingPromo}
                className="px-3 bg-[#161616] w-[71px] h-[42px] text-white rounded-lg  text-sm font-medium hover:bg-gray-800"
              >
                {loadingPromo ? 'Checking...' : 'Apply'}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-gray-700 cursor-pointer"
              />
              <label className="text-xs text-gray-500">
                I agree to the terms and safety policy
              </label>
            </div>

            {msg && <div className="text-red-600 text-sm mt-2">{msg}</div>}
          </div>
        </div>

        {/* RIGHT: Summary section */}
        <div className="bg-white p-8 rounded-xl shadow-sm w-[387px] h-[349px] text-[16px] text-black">
          <div className="flex justify-between mb-2">
            <span className="text-[#656565] ">Experience</span>
            <span>{experience.title}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-[#656565] text-sm">Date</span>
            <span>{selectedDay?.date}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-[#656565] text-sm">Time</span>
            <span>{selectedSlot.time}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span className="text-[#656565] text-sm">Qty</span>
            <span>{quantity}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-[#656565]">Subtotal</span>
            <span>₹{discounted !== null ? discounted * quantity : subtotal}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span className="text-[#656565] text-sm">Taxes</span>
            <span>₹{experience.tax}</span>
          </div>

          <hr className="my-2 w-[339px] h-px text-[#D9D9D9]  " />

          <div className="flex justify-between items-center text-[20px] font-semibold text-[#161616] mb-5">
            <span>Total</span>
            <span>
              ₹{discounted !== null ? discounted * quantity + experience.tax : subtotal + experience.tax}
            </span>
          </div>

          {/* <button
            onClick={submitBooking}
            disabled={bookingLoading || quantity > selectedSlot.remaining}
            className="bg-[#FFD643] hover:bg-[#f8cb27] text-black transition-colors py-2 rounded-lg w-[339px] h-11 gap-2.5 font-semibold"
          > */}

          <button
            onClick={submitBooking}
            disabled={
              bookingLoading ||
              quantity > selectedSlot.remaining ||
              !agreed
            }
            className={`w-[339px] h-11 gap-2.5 font-semibold rounded-lg py-3 transition-colors ${agreed
                ? 'bg-[#FFD643] hover:bg-[#f8cb27] text-black'
                : 'bg-[#D7D7D7] cursor-not-allowed text-[#7F7F7F]'
              }`}
          >

            {bookingLoading ? 'Booking...' : 'Pay and Confirm'}
          </button>
        </div>
      </div>
    </>
  );
}
