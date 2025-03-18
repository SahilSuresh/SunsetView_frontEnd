import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import hotel from "../../../backEnd/src/userModels/hotel";
import SearchCard from "../components/SearchCard";

const Search = () => {
    const search = useSearch();
    // Include useState for future use
    const [page, setPage] = useState(1);
    
    // Create the searchParameter object from search context
    const searchParameter = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childrenCount: search.childrenCount.toString(),
        page: page.toString(),
    };

    // Correct usage of useQuery for @tanstack/react-query v5+
    const { data: hotelData } = useQuery({
        queryKey: ["searchHotels", searchParameter],
        queryFn: () => apiClient.searchHotels(searchParameter)
    });

    return(
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        
                        Find the Best Match
                    </h3>
                    {/* Search Form */}
                </div>

            </div>

            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.totalHotels} Hotel found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    {/* Sort options*/}
                </div>

                {hotelData?.data.map((hotel) => (
                    <SearchCard hotel={hotel} />
                ))}
            </div>

        </div>
    );
};

export default Search;