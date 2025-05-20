import "./Seat.css";

export type SeatData = {
  id: number;
  label: string;
  x: number;
  y: number;
  color?: string;
  status?: 'available' | 'reserved' | 'occupied';
};

type SeatProps = {
  seat: SeatData;
  isSelected: boolean;
  onClick: () => void;
};

export function Seat({ seat, isSelected, onClick }: SeatProps) {
  const { label, x, y, color = '#e0e0e0', status = 'available' } = seat;

  // Determine styling based on status and selection
  let statusStyle = {};
  if (status === 'reserved') {
    statusStyle = { backgroundColor: '#ffcc80', cursor: 'not-allowed' };
  } else if (status === 'occupied') {
    statusStyle = { backgroundColor: '#ef9a9a', cursor: 'not-allowed' };
  }

  const selectionStyle = isSelected ? {
    backgroundColor: '#3b82f6',
    color: 'white',
    transform: 'scale(1.05)',
    zIndex: 10,
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
  } : {};

  return (
    <div 
      className="seat-block" 
      style={{ 
        backgroundColor: color,
        left: `${x}px`,
        top: `${y}px`,
        ...statusStyle,
        ...selectionStyle
      }}
      onClick={status === 'available' ? onClick : undefined}
    >
      {label}
    </div>
  );
}