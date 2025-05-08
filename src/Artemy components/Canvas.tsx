import "./Canvas.css";
import { useState, useRef, useEffect, ReactNode, JSX } from "react";


type CanvasProps = {
  children: ReactNode;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  boundaryMultiplier?: number;
};

// Define TypeScript interfaces
interface Position {
  x: number;
  y: number;
}

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}


export function Canvas({ 
  children, 
  initialScale = 1,
  minScale = 0.5,
  maxScale = 5,
  boundaryMultiplier = 0.5 }: CanvasProps): JSX.Element {

    const [scale, setScale] = useState<number>(initialScale);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [boundaries, setBoundaries] = useState<Boundaries>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Update boundaries when scale changes
  useEffect(() => {
    if (containerRef.current) {
      const boundaryMultiplier = 0.5;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const newBoundaries: Boundaries = ({
        minX: -containerWidth * (scale - 1 + boundaryMultiplier),
        maxX: containerWidth * boundaryMultiplier,
        minY: -containerHeight * (scale - 1 + boundaryMultiplier),
        maxY: containerHeight * boundaryMultiplier
      });
      setBoundaries(newBoundaries);
      
      // Ensure the position stays within bounds when scale changes
      setPosition(prevPos => ({
        x: Math.min(newBoundaries.maxX, Math.max(newBoundaries.minX, prevPos.x)),
        y: Math.min(newBoundaries.maxY, Math.max(newBoundaries.minY, prevPos.y))
      }));
    }
  }, [scale, boundaryMultiplier]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    e.preventDefault();
    
    // Determine zoom direction based on wheel delta
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    // Apply zoom with constraints
    const newScale = Math.max(0.5, Math.min(5, scale * zoomFactor));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.button === 0) { // Only left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDragging) {
      // Calculate the new position
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Apply boundaries using the precalculated values
      const boundedX = Math.min(boundaries.maxX, Math.max(boundaries.minX, newX));
      const boundedY = Math.min(boundaries.maxY, Math.max(boundaries.minY, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };
  
   // Handlers for zoom buttons
   const handleZoomIn = (): void => {
    setScale(prevScale => Math.min(prevScale * 1.2, maxScale));
  };

  const handleZoomOut = (): void => {
    setScale(prevScale => Math.max(prevScale * 0.8, minScale));
  };

  const handleResetView = (): void => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  return (
    

    <div className="canvas-container">
      <div className="zoom-buttons">
      <button 
          className="zoom-button"
          onClick={handleZoomIn}
        >
          Zoom In (+)
        </button>
        <button 
          className="zoom-button"
          onClick={handleZoomOut}
        >
          Zoom Out (-)
        </button>
        <button 
          className="zoom-button"
          onClick={handleResetView}
        >
          Reset View
        </button>
      </div>
      <div 
        className={`zoom-viewport ${isDragging ? 'dragging' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        <div
          className="canvas-content"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Canvas;