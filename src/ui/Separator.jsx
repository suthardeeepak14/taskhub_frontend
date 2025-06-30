import React from "react";
import classNames from "classnames";

export const Separator = ({ className = "", orientation = "horizontal" }) => {
  const baseClass =
    orientation === "horizontal"
      ? "w-full h-px bg-gray-200 my-4"
      : "h-full w-px bg-gray-200 mx-4";

  return <div className={classNames(baseClass, className)} />;
};
