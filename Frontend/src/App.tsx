import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import Details from '../src/pages/Details';
import Checkout from '../src/pages/Checkout';
import Result from '../src/pages/Result';
import Header from '../src/components/Header';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className=" lg:mx-[9%] mx-[3%] p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience/:id" element={<Details />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>
    </div>
  );
}

