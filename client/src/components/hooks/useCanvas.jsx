"use client";

import { useContext } from "react";
import { CanvasContext } from "../context/CanvasContext";

function useCanvas() {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error("useCanvas must be used within a CanvasContext");
  }

  return context;
}

export default useCanvas;