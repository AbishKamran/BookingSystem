"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import './BookingPage.module.css'; 
import { Users, User, Mail, Phone } from "lucide-react";
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    time: "",
    guests: 1,
    phone: "",
    specialRequests: "",
  });

  const cancelBooking = () => {

    setBookingSummary(null);
  
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: 1,
      time: '',
      specialRequests: '',
    });
  
  };
  
  const [bookingSummary, setBookingSummary] = useState(null);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate) return;
      
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setLoading(true);
      
      try {
        const response = await fetch(`${API_URL}/api/slots?date=${formattedDate}`);
        const data = await response.json();
        
        if (data?.available) {
          setAvailableTimes(data.available);
          if (data.booked) {
            setBookedDates(data.booked);
          }
        } else {
          setAvailableTimes([]);
          toast.error("No available slots found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch data");
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.time || !formData.phone || !formData.guests) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        guests: parseInt(formData.guests),
        date: format(selectedDate, "yyyy-MM-dd"),
      };
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBookingSummary(bookingData);
        toast.success("Booking confirmed!");
        setFormData({ name: "", email: "", time: "", guests: 1, phone: "" });
      } else {
        toast.error(data.message === "Time slot not available" 
          ? "Sorry, this time slot is no longer available. Please select another time." 
          : data.message || "Failed to make reservation.");
          
        if (data.message === "Time slot not available") {
          setFormData(prev => ({ ...prev, time: "" }));
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = format(date, "yyyy-MM-dd");
      const isBooked = bookedDates.some(booking => booking.date === formattedDate);
      
      return isBooked ? (
        <div className="h-2 w-2 mx-auto mt-1">
          <div className="bg-red-400 rounded-full h-full w-full" />
        </div>
      ) : null;
    }
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Fine Dining Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Reserve your table for an unforgettable culinary journey through exceptional flavors and ambiance.
        </p>
      </header>

      <Card className="max-w-7xl mx-auto shadow-xl border-0 overflow-hidden bg-white rounded-2xl p-6 md:p-10 lg:p-14">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-8 md:p-10 rounded-t-2xl -mt-6 -mx-6 md:-mx-10 lg:-mx-14">
          <h2 className="text-3xl font-bold text-center">
            {bookingSummary ? "Reservation Confirmed" : "Table Reservation"}
          </h2>
        </CardHeader>

        <CardContent className="p-8 md:p-10 lg:p-14">
          {bookingSummary ? (
            <div className="text-center space-y-8 py-6">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="text-green-600 w-16 h-16" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-green-700 mb-6">Booking Confirmed!</h3>
                <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                  <ul className="text-gray-700 space-y-4 text-lg">
                    <li className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="font-medium">Name:</span>
                      <span>{bookingSummary.name}</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="font-medium">Date:</span>
                      <span>{bookingSummary.date}</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="font-medium">Time:</span>
                      <span>{bookingSummary.time}</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="font-medium">Guests:</span>
                      <span>{bookingSummary.guests}</span>
                    </li>
                    <li className="flex items-center justify-between pb-3">
                      <span className="font-medium">Email:</span>
                      <span className="text-gray-600">{bookingSummary.email}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                    onClick={() => setBookingSummary(null)} 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg transition-all duration-200 text-lg w-full md:w-auto"
                >
                    Make Another Booking
                </Button>
                <Button 
                    onClick={cancelBooking} 
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-all duration-200 text-lg w-full md:w-auto"
                >
                    Cancel Booking
                </Button>
                </div>
            </div>
         ) : (
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-8">Select Date & Time</h3>
                    <style>
                      {`
                        .react-calendar {
                          width: 100%;
                          border: none;
                          font-family: inherit;
                        }
                        .react-calendar__tile {
                          aspect-ratio: 1;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          padding: 0.5em 0.5em;
                          font-size: 1rem;
                        }
                        .react-calendar__month-view__days__day {
                          height: 48px;
                        }
                        .react-calendar__month-view__weekdays {
                          text-align: center;
                          text-transform: uppercase;
                          font-weight: 500;
                          font-size: 0.9rem;
                          padding: 0.5rem 0;
                        }
                        .react-calendar__month-view__weekdays__weekday {
                          padding: 0.5rem;
                        }
                        .react-calendar__navigation {
                          height: auto;
                          padding: 1rem;
                          margin-bottom: 0;
                        }
                        .react-calendar__navigation button {
                          min-width: 44px;
                          height: 44px;
                          margin: 0 4px;
                          border-radius: 8px;
                        }
                        .react-calendar__navigation button:hover {
                          background-color: #f3f4f6;
                        }
                        .react-calendar__tile:enabled:hover,
                        .react-calendar__tile:enabled:focus {
                          background-color: #f3f4f6;
                          border-radius: 8px;
                        }
                        .react-calendar__tile--active {
                          background-color: #1d4ed8 !important;
                          border-radius: 8px;
                        }
                        .react-calendar__tile--now {
                          background-color: #f3f4f6;
                          border-radius: 8px;
                        }
                      `}
                    </style>
                    <div className="calendar-container rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                      <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                        tileContent={tileContent}
                        tileDisabled={tileDisabled}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-8">Available Times</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {loading ? (
                        <div className="col-span-full flex justify-center py-10">
                          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                        </div>
                      ) : availableTimes && availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={formData.time === time ? "default" : "outline"}
                            onClick={() => setFormData({ ...formData, time })}
                            className={`w-full h-14 text-lg font-medium transition-all duration-200 ${
                              formData.time === time 
                                ? "bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
                                : "hover:bg-gray-50 border-2"
                            }`}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-full text-gray-500 text-center py-10 text-lg">
                          No available slots for this date
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-8">Guest Information</h3>
                  <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        required
                    />
                    </div>
                    {formData.name && formData.name.length < 2 && (
                     <div className="text-red-500 text-sm">Name must be at least 2 characters</div>
                )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        required
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number (10 digits)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        pattern="\d{10}"
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        required
                      />
                    </div>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400" />
                         </div>
                    <input
                        type="text"  // Changed from 'number' to 'text' for manual input
                        placeholder="Number of Guests"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        required
                    />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                             <span className="h-5 w-5 text-gray-400"></span> 
                         </div>
                         <textarea
                            placeholder="Special Requests"
                            value={formData.specialRequests}
                            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                            rows={4} // You can adjust the rows for desired height
                        />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !formData.time}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold py-5 rounded-xl shadow-lg transition-all duration-200 mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin w-6 h-6 mr-2" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Complete Reservation"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;