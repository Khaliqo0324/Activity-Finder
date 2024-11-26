// EventFilters.tsx
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

// Move this to types.ts if you prefer
export const EVENT_TYPES = [
  { value: 'all', label: 'All Events' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'art', label: 'Art & Culture' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'networking', label: 'Networking' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
];

export const TIME_FILTERS = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_weekend', label: 'This Weekend' },
  { value: 'next_week', label: 'Next Week' },
  { value: 'custom', label: 'Custom Date' },
];

interface EventFiltersProps {
  searchQuery: string;
  selectedType: string;
  selectedRadius: string;
  selectedDate: Date | undefined;
  selectedTimeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onTimeFilterChange: (value: string) => void;
}

export const EventFilters = ({
  searchQuery,
  selectedType,
  selectedRadius,
  selectedDate,
  selectedTimeFilter,
  onSearchChange,
  onTypeChange,
  onRadiusChange,
  onDateChange,
  onTimeFilterChange,
}: EventFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRadius} onValueChange={onRadiusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1 km</SelectItem>
            <SelectItem value="2000">2 km</SelectItem>
            <SelectItem value="5000">5 km</SelectItem>
            <SelectItem value="10000">10 km</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTimeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            {TIME_FILTERS.map(filter => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};