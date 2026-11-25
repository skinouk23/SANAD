import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
interface BookingCalendarProps {
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
}
export function BookingCalendar({
  onSelectDate,
  onSelectTime
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // Generate next 7 days
  const days = Array.from(
    {
      length: 7
    },
    (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        dayName: d.
        toLocaleDateString('fr-FR', {
          weekday: 'short'
        }).
        replace('.', ''),
        dayNumber: d.getDate(),
        fullDate: d,
        available: i !== 2 // Mock unavailable day
      };
    }
  );
  const timeSlots = [
  {
    id: 'morning',
    label: 'Matin',
    slots: ['08:00', '09:00', '10:00', '11:00']
  },
  {
    id: 'afternoon',
    label: 'Après-midi',
    slots: ['13:00', '14:00', '15:00', '16:00']
  },
  {
    id: 'evening',
    label: 'Soir',
    slots: ['17:00', '18:00', '19:00', '20:00']
  }];

  const handleDateClick = (index: number, date: Date) => {
    setSelectedDate(index);
    onSelectDate(date);
    setSelectedTime(null); // Reset time when date changes
  };
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };
  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Choisir une date
          </h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) =>
          <button
            key={index}
            disabled={!day.available}
            onClick={() => handleDateClick(index, day.fullDate)}
            className={`
                flex flex-col items-center justify-center p-3 rounded-xl transition-all
                ${selectedDate === index ? 'bg-teal-600 text-white shadow-md scale-105' : day.available ? 'bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-transparent'}
              `}>
            
              <span className="text-xs font-medium uppercase mb-1">
                {day.dayName}
              </span>
              <span className="text-xl font-bold">{day.dayNumber}</span>
            </button>
          )}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choisir une heure
        </h3>
        <div className="space-y-6">
          {timeSlots.map((period) =>
          <div key={period.id}>
              <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                {period.label}
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {period.slots.map((time) =>
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`
                      py-2 px-4 rounded-lg text-sm font-medium transition-all
                      ${selectedTime === time ? 'bg-rose-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'}
                    `}>
                
                    {time}
                  </button>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}