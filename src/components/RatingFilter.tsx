import React from "react";

type Props = {
  selectedRating: string | null;
  onChange: (rating: string | null) => void;
};

const RatingFilter = ({ selectedRating, onChange }: Props) => {
  // This function handles both selection and deselection using onClick
  const handleRatingClick = (rating: string) => {
    // If the current rating is already selected, deselect it (set to null)
    // Otherwise, select the new rating
    onChange(selectedRating === rating ? null : rating);
  };

  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Property Rating</h4>
      <div className="flex flex-wrap gap-2">
        {["5", "4", "3", "2", "1"].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`flex items-center px-3 py-2 rounded-full border transition-colors 
              ${selectedRating === rating 
                ? "border-orange-500 bg-orange-50 text-orange-600" 
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            onClick={() => handleRatingClick(rating)}
          >
            <span className="font-medium">
              {rating} {rating === "1" ? "Star" : "Stars"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;