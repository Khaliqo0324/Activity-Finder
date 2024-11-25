import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlaceCard } from './PlaceCard';
import { Place } from './types';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  places: Place[];
}

// Memoized PlaceCard to prevent unnecessary re-renders
const MemoizedPlaceCard = memo(PlaceCard);

const LoadingState = () => (
  <div className="flex justify-center items-center py-8" role="status" aria-label="Loading results">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    <span className="sr-only">Loading places...</span>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <Alert variant="destructive" role="alert">
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div 
    className="text-center py-8 text-gray-500"
    role="status"
    aria-label="No results found"
  >
    No places found
  </div>
);

export const SearchResults = React.memo(({ isLoading, error, places }: SearchResultsProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (places.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      className="space-y-4"
      role="list"
      aria-label="Search results"
    >
      {places.map(place => (
        <MemoizedPlaceCard 
          key={place.place_id || place.id} // Fallback to id if place_id is not available
          place={place} 
        />
      ))}
    </div>
  );
});

// Add display name for better debugging
SearchResults.displayName = 'SearchResults';

// Error boundary to catch rendering errors
class SearchResultsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SearchResults Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Something went wrong loading the search results. Please try again.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Export wrapped component with error boundary
export default function SearchResultsWithErrorBoundary(props: SearchResultsProps) {
  return (
    <SearchResultsErrorBoundary>
      <SearchResults {...props} />
    </SearchResultsErrorBoundary>
  );
}