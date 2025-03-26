import React from "react";
import { hotelTypes } from "../config/hotelType-config";

type Props = {
  selectedType: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TypesFilter = ({ selectedType, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Hotel Type</h4>
      <div className="space-y-3">
        {hotelTypes.map((type) => (
          <div key={type} className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded"
                value={type}
                checked={selectedType.includes(type)}
                onChange={onChange}
              />
              <div className="flex items-center">
                <span className="ml-1 text-gray-800">{type}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypesFilter;