export interface Slot {
  _id: string;
  date: string;
  time: string;
  price: number;
  remaining: number;
}

export interface Experience {
  _id: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
  duration?: string;
  rating?: number;
  slots: Slot[];
  price: number;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  pricePaid?: number;
}
