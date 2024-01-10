import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedUi({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div>Shared UI component!</div>
      <div>{children}</div>
    </div>
  );
}

export default SharedUi;
