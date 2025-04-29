import "./Seat.css";

type SeatProps = {
    bgColor: string;
    number: number;
};

export function Seat({ bgColor, number }: SeatProps) {
    return (
        <div className="seat-block" style={{ backgroundColor: bgColor }}>
            <div>{number}</div>
        </div>
    );
}