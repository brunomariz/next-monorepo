import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedButton({ children }: Props) {
  return (
    <button
      className="p-5 rounded-lg bg-gray-100"
      onClick={() => alert("This is a shared component!")}
    >
      {children}
    </button>
  );
}

export default SharedButton;
