import Button from "./sharedUiComponents/button";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedUi({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-3xl text-myGreen bg-gray-100 p-2 rounded-md">
        Shared UI component!
      </div>
      <div>{children}</div>
    </div>
  );
}

export { Button };
export { SharedUi };
