import './App.css';
import { useState } from 'react';
import { Seat, SeatData } from './Artemy components/Seat';
import { Canvas } from './Artemy components/Canvas';
import { seatConfig } from './Artemy components/seatConfig.ts';

function App() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [seats, setSeats] = useState<SeatData[]>(seatConfig);
  const [count, setCount] = useState<number | null>(null);

  const handleSeatClick = (seatId: number) => {
    setSelectedSeat(seatId);
  };

  const getSelectedSeatInfo = () => {
    if (!selectedSeat) return null;
    const seat = seats.find(s => s.id === selectedSeat);
    return seat ? `Selected seat: ${seat.label} (ID: ${seat.id}, X: ${seat.x}, Y: ${seat.y})` : null;
  };

  const countReservedOrOccupiedSeats = () => {
    const reservedOrOccupiedSeats = seats.filter(
      seat => seat.status === 'reserved' || seat.status === 'occupied'
    ).length;
    setCount(reservedOrOccupiedSeats);
  };

  return (
    <div className="app-container">
      <h1>Select Seat</h1>

      <Canvas width={400} height={300}>
        {seats.map(seat => (
          <Seat 
            key={seat.id}
            seat={seat}
            isSelected={selectedSeat === seat.id}
            onClick={() => handleSeatClick(seat.id)}
          />
        ))}
      </Canvas>

      {selectedSeat && (
        <p className="selected-seat-info">
          {getSelectedSeatInfo()}
        </p>
      )}

      <button className="count-button" onClick={countReservedOrOccupiedSeats}>
        Count Reserved/Occupied Seats
      </button>

      {count !== null && (
        <p className="count-info">
          Total Reserved/Occupied Seats: {count}
        </p>
      )}
    </div>
  );
}

export default App;
