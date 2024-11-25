// SearchFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLACE_TYPES, RADIUS_OPTIONS } from './types';

interface SearchFiltersProps {
  searchQuery: string;
  selectedType: string;
  selectedRadius: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
}

export const SearchFilters = ({
  searchQuery,
  selectedType,
  selectedRadius,
  onSearchChange,
  onTypeChange,
  onRadiusChange
}: SearchFiltersProps) => (
  <div className="space-y-4 mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search places..."
        className="w-full pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <div className="flex gap-4">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {PLACE_TYPES.map(type => (
            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedRadius} onValueChange={onRadiusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select radius" />
        </SelectTrigger>
        <SelectContent>
          {RADIUS_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);