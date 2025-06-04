import './App.css';
import { useState, useEffect } from 'react';
import { Seat, SeatData } from './components/Seat';
import { Canvas } from './components/Canvas';
import { 
  loadSeatConfigFromJson, 
  loadAllEventsConfiguration, 
  forceRefreshEvents,
  EventConfiguration, 
  Event 
} from './components/seatConfig';

function App() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [show, setShow] = useState<boolean | null>(false);
  const [availableCount, setAvailableCount] = useState<number | null>(0);
  const [unavailableCount, setOccupiedCount] = useState<number | null>(0);
  const [totalCount, setTotalCount] = useState<number | null>(0);
  const [currentEventInfo, setCurrentEventInfo] = useState<Event | null>(null);
  const [currentEventText, setCurrentEventText] = useState<boolean | null>(null);
  const [seatBounds, setSeatBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const [allEvents, setAllEvents] = useState<EventConfiguration[]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load all events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const eventsConfig = await loadAllEventsConfiguration();
      setAllEvents(eventsConfig);
      setLastUpdated(new Date().toLocaleTimeString());
      
      // Load first event by default if available
      if (eventsConfig.length > 0) {
        loadEventByIndex(0);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh data from server
  const handleForceRefresh = async () => {
    setIsLoading(true);
    try {
      console.log('Forcing refresh of events data...');
      await forceRefreshEvents();
      await loadEvents();
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load specific event by index
  const loadEventByIndex = async (index: number) => {
    try {
      const eventConfig = await loadSeatConfigFromJson(index);
      
      setSeats(eventConfig.seatConfig);
      setAvailableCount(eventConfig.availabilityCounts.availableCount);
      setOccupiedCount(eventConfig.availabilityCounts.unavailableCount);
      setTotalCount(eventConfig.availabilityCounts.totalCount);
      setCurrentEventInfo(eventConfig.eventInfo);
      setCurrentEventText(eventConfig.text);
      setSeatBounds(eventConfig.coordinateBounds);
      setSelectedEventIndex(index);
      setSelectedSeat(null); // Reset selected seat
      setShow(false); // Hide counts
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  const handleSeatClick = (seatId: number) => {
    setSelectedSeat(seatId);
  };

  const getSelectedSeatInfo = () => {
    if (!selectedSeat) return null;
    const seat = seats.find(s => s.id === selectedSeat);
    return seat ? `Selected seat: ${seat.label} (Price: ${seat.price}€, X: ${seat.x}, Y: ${seat.y})` : null;
  };

  const countAvailableReservedTotalSeats = () => {
    setShow(!show);
  };

  const handleEventClick = (index: number) => {
    loadEventByIndex(index);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="header-section">
          <h1>Select Seat</h1>
          <div className="refresh-section">
            <button 
              className="refresh-button" 
              onClick={handleForceRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : '🔄 Update data'}
            </button>
            {lastUpdated && (
              <p className="last-updated">Last update: {lastUpdated}</p>
            )}
          </div>
        </div>
        
        <h2>{currentEventInfo?.title}</h2>
        <div className="event-info">
          <p>Date: {currentEventInfo?.date || 'No date specified'}</p>
          <p>Location: {currentEventInfo?.location}</p>
          <p>Price from: {currentEventInfo?.priceMin}</p>
        </div>

        {/* Show seats layout for events with specific seats */}
        {currentEventText === null && seats.length > 0 && (
          <>
            <Canvas seatBounds={seatBounds} padding={10} width={400} height={300}>
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

            <button className="count-button" onClick={countAvailableReservedTotalSeats}>
              Count Available/Occupied/Total Seats
            </button>

            {show && (
              <div>
                <p className="count-info">Total Available Seats: {availableCount}</p>
                <p className="count-info">Total Occupied Seats: {unavailableCount}</p>
                <p className="count-info">Total Seats: {totalCount}</p>
              </div>
            )}
          </>
        )}

        {/* Show availability status for events without specific seats */}
        {currentEventText !== null && (
          <div className="general-tickets-info">
            <h3>General Entry Tickets</h3>
            <p className={`availability-status ${currentEventText ? 'available' : 'unavailable'}`}>
              Status: {currentEventText ? 'Available' : 'Sold Out'}
            </p>
            <p>This event uses general entry tickets without specific seat selection.</p>
          </div>
        )}
      </div>

      {/* Events list sidebar */}
      <div className="events-sidebar">
        <h3>All Events</h3>
        <div className="events-list">
          {isLoading ? (
            <div className="loading-indicator">
              <p>Загрузка событий...</p>
            </div>
          ) : (
            allEvents.map((eventConfig, index) => (
              <div 
                key={index}
                className={`event-item ${selectedEventIndex === index ? 'selected' : ''}`}
                onClick={() => handleEventClick(index)}
              >
                <h4>{eventConfig.eventInfo?.title}</h4>
                <p className="event-location">{eventConfig.eventInfo?.location}</p>
                <p className="event-date">{eventConfig.eventInfo?.date || 'No date'}</p>
                <p className="event-price">From: {eventConfig.eventInfo?.priceMin}</p>
                
                {/* Show seat type indicator */}
                <div className="seat-type-indicator">
                  {eventConfig.text === null ? (
                    <span className="has-seats">🪑 Seat Selection</span>
                  ) : (
                    <span className={`general-tickets ${eventConfig.text ? 'available' : 'unavailable'}`}>
                      🎫 {eventConfig.text ? 'Available' : 'Sold Out'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;