import "./Canvas.css";
import { useState, useRef, useEffect, ReactNode, JSX } from "react";

// Interface for coordinate bounds from seat data
interface CoordinateBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

type CanvasProps = {
  children: ReactNode;
  seatBounds: CoordinateBounds;
  padding?: number;
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
  seatBounds,
  padding = 50,
  initialScale = 1,
  minScale = 0.5,
  maxScale = 5,
  boundaryMultiplier = 0.5 
}: CanvasProps): JSX.Element {
  const [scale, setScale] = useState<number>(initialScale);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [boundaries, setBoundaries] = useState<Boundaries>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate canvas dimensions based on seat bounds
  const canvasWidth = seatBounds.maxX - seatBounds.minX + (padding * 2);
  const canvasHeight = seatBounds.maxY - seatBounds.minY + (padding * 2);

  // Update boundaries and center content when scale or children change
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const newBoundaries: Boundaries = {
        minX: -containerWidth * (scale - 1 + boundaryMultiplier),
        maxX: containerWidth * boundaryMultiplier,
        minY: -containerHeight * (scale - 1 + boundaryMultiplier),
        maxY: containerHeight * boundaryMultiplier,
      };
      setBoundaries(newBoundaries);

      // Center content initially
      const offsetX = (containerWidth - canvasWidth * scale) / 2;
      const offsetY = (containerHeight - canvasHeight * scale) / 2;
      setPosition({
        x: offsetX,
        y: offsetY,
      });
    }
  }, [scale, children, boundaryMultiplier, canvasWidth, canvasHeight]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(minScale, Math.min(maxScale, scale * zoomFactor));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const boundedX = Math.min(boundaries.maxX, Math.max(boundaries.minX, newX));
      const boundedY = Math.min(boundaries.maxY, Math.max(boundaries.minY, newY));
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = (): void => setIsDragging(false);

  const handleZoomIn = (): void => {
    setScale(prevScale => Math.min(prevScale * 1.2, maxScale));
  };

  const handleZoomOut = (): void => {
    setScale(prevScale => Math.max(prevScale * 0.8, minScale));
  };

  const handleResetView = (): void => {
    setScale(initialScale);
    // Reset to center position
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const offsetX = (containerWidth - canvasWidth * initialScale) / 2;
      const offsetY = (containerHeight - canvasHeight * initialScale) / 2;
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  return (
    <div className="canvas-container">
      <div className="zoom-buttons">
        <button className="zoom-button" onClick={handleZoomIn}>
          Zoom In (+)
        </button>
        <button className="zoom-button" onClick={handleZoomOut}>
          Zoom Out (-)
        </button>
        <button className="zoom-button" onClick={handleResetView}>
          Reset View
        </button>
      </div>
      <div
        className={`zoom-viewport ${isDragging ? "dragging" : ""}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
        style={{
          width: Math.max(400, canvasWidth + 150), // Minimum width 400px
          height: Math.max(300, canvasHeight + 150) // Minimum height 300px
        }}
      >
        <div
          className="canvas-content"
          style={{
            transform: `scale(${scale}) translate(0px, 0px)`,
            width: canvasWidth + 50,
            height: canvasHeight + 50,
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -seatBounds.minX + padding,
              top: -seatBounds.minY + padding,
              width: seatBounds.maxX - seatBounds.minX,
              height: seatBounds.maxY - seatBounds.minY
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;