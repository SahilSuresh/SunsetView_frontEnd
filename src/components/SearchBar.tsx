import { FormEvent, useState } from "react";
import { useSearch } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import { HiCalendar, HiUsers } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const searchBar = useSearch();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<string>(searchBar.destination);
  const [checkIn, setCheckIn] = useState<Date>(searchBar.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(searchBar.checkOut);
  const [adultCount, setAdultCount] = useState<number>(searchBar.adultCount);
  const [childrenCount, setChildrenCount] = useState<number>(
    searchBar.childrenCount
  ); 

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    searchBar.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childrenCount
    );
    navigate("/search");
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildrenCount(0);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 365);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-4 bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-7xl mx-auto mt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="flex flex-row items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400">
          <MdTravelExplore size={20} className="text-orange-500 mr-2 flex-shrink-0" />
          <input
            placeholder="Where are you going?"
            className="text-md w-full bg-transparent focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </div>

        {/* Date Pickers */}
        <div className="flex flex-row items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400">
          <HiCalendar size={20} className="text-orange-500 mr-2 flex-shrink-0" />
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in date"
            className="w-full bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex flex-row items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400">
          <HiCalendar size={20} className="text-orange-500 mr-2 flex-shrink-0" />
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date as Date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            maxDate={maxDate}
            placeholderText="Check-out date"
            className="w-full bg-transparent focus:outline-none"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-row items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400">
          <HiUsers size={20} className="text-orange-500 mr-2 flex-shrink-0" />
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-1">Adults:</label>
              <input
                className="w-12 bg-transparent p-1 focus:outline-none font-bold text-center"
                type="number"
                min={1}
                max={20}
                value={adultCount}
                onChange={(event) => setAdultCount(parseInt(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-1">Children:</label>
              <input
                className="w-12 bg-transparent p-1 focus:outline-none font-bold text-center"
                type="number"
                min={0}
                max={20}
                value={childrenCount}
                onChange={(event) => setChildrenCount(parseInt(event.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center mt-4 gap-3">
        <button 
          type="submit"
          className="bg-gradient-to-r from-orange-300 to-orange-500 text-white font-bold px-6 py-2 rounded-full hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
        >
          Find Hotels
        </button>
        <button 
          type="button"
          onClick={handleClear}
          className="bg-white text-orange-500 border border-orange-400 font-bold px-4 py-2 rounded-full hover:bg-orange-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;