import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../../contexts/SearchContext";
import * as apiClient from "../../api-client";
import SearchCard from "../../components/search/SearchCard";
import Pagination from "../../components/common/Pagination";
import RatingFilter from "../../components/filters/RatingFilter";
import { hotelTypes, hotelFacilities } from "../../config/hotelType-config";
import { HiChevronDown, HiChevronUp, HiFilter, HiX } from "react-icons/hi";
import React from "react";

type SortOption = "ratingHighToLow" | "pricePerNightLowToHigh" | "pricePerNightHighToLow";

const Search = () => {
  const search = useSearch();
  const [page, setPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<string[]>([]);
  const [selectedTypes, setSelectedType] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption | "">("");
  
  // State for expanded sections
  const [typesExpanded, setTypesExpanded] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  
  // State for mobile filter drawer
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Popular hotel types to show initially
  const popularTypes = [
    "Beach Resort",
    "Luxury",
    "Budget",
    "Family",
    "Business",
    "Boutique",
    "Motel",
  ];
  
  // Popular facilities to show initially
  const popularFacilities = [
    "Free WiFi",
    "Swimming Pool",
    "Free Parking",
    "Restaurant",
    "Fitness Center",
    "Spa",
    "Airport Shuttle",
  ];
  
  // Display limited items unless expanded
  const displayedTypes = typesExpanded ? hotelTypes : popularTypes;
  const displayedFacilities = facilitiesExpanded ? hotelFacilities : popularFacilities;

  // Create the searchParameter object from search context
  const searchParameter = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childrenCount: search.childrenCount.toString(),
    page: page.toString(),
    ...(selectedRating.length > 0 && { rating: selectedRating }), // Modified to handle array
    ...(selectedTypes.length > 0 && { type: selectedTypes }),
    ...(selectedFacilities.length > 0 && { facilities: selectedFacilities }),
    ...(sortOption && { sortOption }),
  };

  // Count active filters
  const activeFilterCount = 
    selectedRating.length + 
    selectedTypes.length + 
    selectedFacilities.length;

  // Fetch hotels with current search parameters
  const { data: hotelData, isLoading } = useQuery({
    queryKey: ["searchHotels", searchParameter],
    queryFn: () => apiClient.searchHotels(searchParameter),
  });

  // Handler for the multi-select rating filter
  const handleRatingChange = (ratings: string[]) => {
    setSelectedRating(ratings);
    setPage(1); // Reset to page 1 when filter changes
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value;

    setSelectedType((prevType) =>
      event.target.checked
        ? [...prevType, type]
        : prevType.filter((t) => t !== type)
    );
    
    setPage(1);
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((f) => f !== facility)
    );
    
    setPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
    setPage(1);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedRating([]);
    setSelectedType([]);
    setSelectedFacilities([]);
    setPage(1);
  };
  
  // Toggle filter drawer for mobile
  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
    // Prevent body scrolling when drawer is open
    document.body.style.overflow = filterDrawerOpen ? 'auto' : 'hidden';
  };
  
  // Apply filters and close drawer on mobile
  const applyFilters = () => {
    setFilterDrawerOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Cleanup body overflow on unmount
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const FiltersContent = () => (
    <>
      {/* Property Rating Filter */}
      <div className="mb-6">
        <RatingFilter 
          selectedRating={selectedRating} 
          onChange={handleRatingChange} 
        />
      </div>
      
      {/* Hotel Type Filter */}
      <div className="mb-6 border-t border-slate-200 pt-4">
        <h4 className="text-md font-semibold mb-3">Hotel Type</h4>
        <div className="space-y-2">
          {displayedTypes.map((type) => (
            <div key={type} className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded accent-orange-500"
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={handleTypeChange}
                />
                <span className="text-gray-700">{type}</span>
              </label>
            </div>
          ))}
          
          {hotelTypes.length > popularTypes.length && (
            <button 
              onClick={() => setTypesExpanded(!typesExpanded)}
              className="flex items-center text-orange-500 hover:text-orange-600 text-sm mt-2"
            >
              {typesExpanded ? (
                <>
                  <span>Show Less</span>
                  <HiChevronUp className="ml-1" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <HiChevronDown className="ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Facilities Filter */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-md font-semibold mb-3">Facilities</h4>
        <div className="space-y-2">
          {displayedFacilities.map((facility) => (
            <div key={facility} className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded accent-orange-500"
                  value={facility}
                  checked={selectedFacilities.includes(facility)}
                  onChange={handleFacilityChange}
                />
                <span className="text-gray-700">{facility}</span>
              </label>
            </div>
          ))}
          
          {hotelFacilities.length > popularFacilities.length && (
            <button 
              onClick={() => setFacilitiesExpanded(!facilitiesExpanded)}
              className="flex items-center text-orange-500 hover:text-orange-600 text-sm mt-2"
            >
              {facilitiesExpanded ? (
                <>
                  <span>Show Less</span>
                  <HiChevronUp className="ml-1" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <HiChevronDown className="ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Desktop Sidebar Filters - Hidden on mobile */}
      <div className="hidden lg:block rounded-lg border border-slate-300 p-5 h-fit sticky top-24 bg-white">
        <h3 className="text-lg font-semibold border-b border-slate-300 pb-3 mb-4">
          Filter by:
        </h3>
        
        <FiltersContent />
        
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="mt-6 w-full py-2 text-orange-500 border border-orange-400 rounded-full hover:bg-orange-50 font-medium text-sm transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 z-20 flex justify-center">
        <button
          onClick={toggleFilterDrawer}
          className="flex items-center bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-6 rounded-full shadow-lg font-bold"
        >
          <HiFilter className="mr-2" size={20} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>
      
      {/* Mobile Filter Drawer */}
      {filterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
          <div className="bg-white rounded-t-xl mt-auto overflow-y-auto max-h-[85vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold">Filters</h3>
              <button 
                onClick={toggleFilterDrawer}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <HiX size={24} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <FiltersContent />
            </div>
            
            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex-1 py-2 text-orange-500 border border-orange-400 rounded-full font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={applyFilters}
                className="flex-1 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full"
              >
                Show Results ({hotelData?.pagination.totalHotels || 0})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col gap-5 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xl font-bold">
            {hotelData?.pagination.totalHotels} Hotel{hotelData?.pagination.totalHotels !== 1 ? 's' : ''} found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          
          {/* Sort options */}
          <div className="flex items-center w-full sm:w-auto mt-2 sm:mt-0">
            <span className="mr-2 text-gray-600">Sort By</span>
            <select 
              className="bg-white border border-gray-300 rounded-md px-4 py-2 outline-none text-gray-700 flex-grow sm:flex-grow-0"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Recommended</option>
              <option value="ratingHighToLow">Rating: High to Low</option>
              <option value="pricePerNightLowToHigh">Price: Low to High</option>
              <option value="pricePerNightHighToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-4 text-lg text-gray-700">Loading hotels...</span>
            </div>
          </div>
        ) : hotelData?.data.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-slate-200 p-6 text-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          </div>
        ) : (
          <>
            {hotelData?.data.map((hotel) => (
              <SearchCard key={hotel._id} hotel={hotel} />
            ))}

            {hotelData && hotelData.pagination.pages > 1 && (
              <Pagination
                page={hotelData.pagination.page}
                totalPages={hotelData.pagination.pages}
                onClickPage={(page) => setPage(page)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;