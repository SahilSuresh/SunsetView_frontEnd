import React, { useContext } from "react";

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childrenCount: number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childrenCount: number
  ) => void; //this function will not return anything
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined); //create a context undefined because the first time it load it will be undefined
type SearchProviderProps = {
  children: React.ReactNode;
};
export const SearchProvider = ({ children }: SearchProviderProps) => {
  //children is the component that will be wrapped by the provider and give it value to the context
  const [destination, setDestination] = React.useState<string>(""); //set the default value to empty string
  const [checkIn, setCheckIn] = React.useState<Date>(new Date()); //set the default new date
  const [checkOut, setCheckOut] = React.useState<Date>(new Date()); //set the default new date
  const [adultCount, setAdultCount] = React.useState<number>(1); //set the default value to 1
  const [childrenCount, setChildrenCount] = React.useState<number>(0); //set the default value to 0
  const [hotelId, setHotelId] = React.useState<string>("");

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childrenCount: number,
    hotelId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildrenCount(childrenCount);
    if (hotelId) {
      setHotelId(hotelId);
    }
    
  };

  return <SearchContext.Provider value={{
    destination,
    checkIn,
    checkOut,
    adultCount,
    childrenCount,
    hotelId,
    saveSearchValues,
  }}>{children}</SearchContext.Provider>;
};


export const useSearch = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
}
