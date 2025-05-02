import { SeatData } from './Seat';

// Define your seat layout with specific coordinates
export const seatConfig: SeatData[] = [
  // Front row (A)
  { id: 1, label: 'A1', x: 50, y: 30, color: '#e0e0e0' },
  { id: 2, label: 'A2', x: 100, y: 30, color: '#e0e0e0' },
  { id: 3, label: 'A3', x: 150, y: 30, color: '#e0e0e0' },
  { id: 4, label: 'A4', x: 200, y: 30, color: '#e0e0e0' },
  { id: 5, label: 'A5', x: 250, y: 30, color: '#e0e0e0' },
  { id: 6, label: 'A6', x: 300, y: 30, color: '#e0e0e0' },
  
  // Second row (B)
  { id: 7, label: 'B1', x: 50, y: 80, color: '#c0c0c0' },
  { id: 8, label: 'B2', x: 100, y: 80, color: '#c0c0c0' },
  { id: 9, label: 'B3', x: 150, y: 80, color: '#c0c0c0' },
  { id: 10, label: 'B4', x: 200, y: 80, color: '#c0c0c0' },
  { id: 11, label: 'B5', x: 250, y: 80, color: '#c0c0c0' },
  { id: 12, label: 'B6', x: 300, y: 80, color: '#c0c0c0' },
  
  // Third row (C) - with a gap in the middle
  { id: 13, label: 'C1', x: 50, y: 130, color: '#e0e0e0' },
  { id: 14, label: 'C2', x: 100, y: 130, color: '#e0e0e0' },
  { id: 15, label: 'C3', x: 150, y: 130, color: '#e0e0e0' },
  { id: 16, label: 'C4', x: 200, y: 130, color: '#e0e0e0', status: 'reserved' },
  { id: 17, label: 'C5', x: 250, y: 130, color: '#e0e0e0', status: 'occupied' },
  { id: 18, label: 'C6', x: 300, y: 130, color: '#e0e0e0' },
  
  // Fourth row (D) - with a different pattern
  { id: 19, label: 'D1', x: 75, y: 180, color: '#c0c0c0' },
  { id: 20, label: 'D2', x: 125, y: 180, color: '#c0c0c0' },
  { id: 21, label: 'D3', x: 175, y: 180, color: '#c0c0c0' },
  { id: 22, label: 'D4', x: 225, y: 180, color: '#c0c0c0' },
  { id: 23, label: 'D5', x: 275, y: 180, color: '#c0c0c0' },
  
  // Fifth row (E) - curved pattern
  { id: 24, label: 'E1', x: 50, y: 240, color: '#e0e0e0' },
  { id: 25, label: 'E2', x: 110, y: 230, color: '#e0e0e0' },
  { id: 26, label: 'E3', x: 170, y: 230, color: '#e0e0e0' },
  { id: 27, label: 'E4', x: 230, y: 230, color: '#e0e0e0' },
  { id: 28, label: 'E5', x: 290, y: 240, color: '#e0e0e0' },
];

// You can define other layouts as needed
export const circleLayout: SeatData[] = generateCircleLayout(150, 150, 100, 12);
export const rectangleLayout: SeatData[] = generateRectangleLayout(50, 50, 300, 200, 6, 4);

// Helper function to generate seats in a circle
function generateCircleLayout(
  centerX: number, 
  centerY: number, 
  radius: number, 
  numSeats: number
): SeatData[] {
  const seats: SeatData[] = [];
  
  for (let i = 0; i < numSeats; i++) {
    const angle = (i / numSeats) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - 20; // Adjust for seat width
    const y = centerY + radius * Math.sin(angle) - 20; // Adjust for seat height
    
    seats.push({
      id: i + 1,
      label: `C${i + 1}`,
      x,
      y,
      color: i % 2 === 0 ? '#e0e0e0' : '#c0c0c0'
    });
  }
  
  return seats;
}

// Helper function to generate seats in a rectangle
function generateRectangleLayout(
  startX: number,
  startY: number,
  width: number,
  height: number,
  columns: number,
  rows: number
): SeatData[] {
  const seats: SeatData[] = [];
  const xStep = width / columns;
  const yStep = height / rows;
  let id = 1;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = startX + col * xStep;
      const y = startY + row * yStep;
      
      seats.push({
        id: id++,
        label: `${String.fromCharCode(65 + row)}${col + 1}`,
        x,
        y,
        color: (row + col) % 2 === 0 ? '#e0e0e0' : '#c0c0c0'
      });
    }
  }
  
  return seats;
}