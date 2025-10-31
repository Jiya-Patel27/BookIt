// import React from 'react';
import type { Experience } from '../types';
import { Link } from 'react-router-dom';

export default function ExperienceCard({ exp }: { exp: Experience }) {
  // const price = exp.slots?.[0]?.price ?? 0;
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden w-[280px] h-[330px] hover:scale-102 transition-transform duration-300">
      <img src={exp.image} alt={exp.title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex justify-between gap-10">
          <div><h3 className="font-semibold text-[16px]">{exp.title}</h3></div>
          <div className="w-[50px] h-[23px] rounded-sm text-[10px] bg-[#D6D6D6] py-1 text-center">{exp.location}</div>
        </div>
        <p className="mt-2 text-[12px] text-gray-600 line-clamp-2">{exp.description}</p>
        <div className='flex justify-between py-3'>
          <div className="text-left">
            <div className="text-[12px]">From <span className='font-bold text-[20px]'>₹{exp.price}</span></div>
            {/* <div className="text-xs text-gray-500">avg / person</div> */}
          </div>
          {/* <div className="text-right w-[99px] h-[30px] py-1.5 px-2 bg-[#FFD643] rounded-sm text-[14px] flex items-center justify-center font-medium"> */}
          <Link to={`/experience/${exp._id}`} className="w-[99px] h-[30px] py-1 px-1 bg-[#FFD643] hover:bg-[#f8cb27] rounded-sm text-[14px] text-center font-medium">View Details</Link>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
