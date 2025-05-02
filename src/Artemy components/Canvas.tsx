import "./Canvas.css";
import { ReactNode } from "react";

type CanvasProps = {
  children: ReactNode;
  width?: number;
  height?: number;
};

export function Canvas({ children, width = 400, height = 300 }: CanvasProps) {
  return (
    <div 
      className="canvas-container"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {children}
    </div>
  );
}

export default Canvas;