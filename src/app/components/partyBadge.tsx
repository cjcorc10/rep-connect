import clsx from "clsx";
import React from "react";

type PartyBadgeProps = {
  party: string;
};

function PartyBadge({ party }: PartyBadgeProps) {
  return (
    <div
      className={clsx(
        "font-bold text-white shadow-md relative rounded-full text-center flex items-center justify-center",
        {
          "bg-blue-500": party === "Democrat",
          "bg-red-500": party === "Republican",
          "bg-green-500": party === "Independent",
          "bg-gray-500": !party,
        }
      )}
    >
      {party.charAt(0)}
    </div>
  );
}

export default PartyBadge;
