import React, { useState, useMemo } from 'react'; 
import { Search } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Search {
  id: number;
  activity: string;
  location: string;
  preview: string;
  timestamp: string;
  tags: string[];
  isVerified?: boolean;
  imageUrl: string;
}

const SearchInbox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false); // Modal state
  const [isOnAddModalOpen, setOnAddModalOpen] = useState(false);
  
  const results: Search[] = [
    {
      id: 1,
      activity: "Art Club",
      location: "Science Learning Center",
      preview: "Attend the art club meeting today and enjoy making something special",
      timestamp: "12/4/2024",
      tags: ["meeting", "club", "important"],
      imageUrl: "https://www.freeiconspng.com/uploads/maps-icon-16.png",
    },
    {
        id: 2,
        activity: "Physics Club",
        location: "Miller Plant",
        preview: "Attend the physics club meeting today and enjoy making something special",
        timestamp: "12/4/2024",
        tags: ["meeting", "club"],
        imageUrl: "https://www.freeiconspng.com/uploads/maps-icon-16.png",
    },
    {
      id: 3,
        activity: "Run Club",
        location: "Myers Quad",
        preview: "Run and explore Athens with a group of likeminded students...",
        timestamp: "12/4/2024",
        tags: ["meeting", "club"],
        imageUrl: "https://www.freeiconspng.com/uploads/maps-icon-16.png",
    },
    // Additional results here...
  ];

  const filteredSearches = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return results;
    
    return results.filter(result => {
      const searchableContent = [
        result.activity,
        result.location,
        result.preview,
        ...result.tags
      ].join(' ').toLowerCase();
      
      return searchableContent.includes(query);
    });
  }, [searchQuery]);

  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const toggleFavoritesModal = () => {
    setFavoritesModalOpen(!isFavoritesModalOpen);
  };

  const toggleOnAddModal = () => {
    setOnAddModalOpen(!isOnAddModalOpen);
  };
  
  


  

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200">
        {/* Buttons above the search bar */}
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Discover</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white">
                Discover
              </Button>
              <Button variant="outline" className="bg-white" onClick={toggleFavoritesModal}>
                Favorites 
              </Button>
              <Button variant="outline" className="bg-white">
                Host
              </Button>
              <Button variant="outline" className="bg-white">
                Filter
              </Button>
              <Button variant="outline" className="bg-white" onClick={toggleOnAddModal}>
                Add Event 
              </Button >
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search results..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search results */}
        <div className="space-y-4">
          {filteredSearches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found matching "{searchQuery}"
            </div>
          ) : (
            filteredSearches.map((result) => (
              <Card key={result.id} className="hover:bg-gray-50 cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        <div>
                        <Button variant="outline" className="bg-white">
                            Add to Favorites
                        </Button>
                        </div>
                        <div>
                          <img src={result.imageUrl} alt="img" className='h-20 w-20'></img>
                        </div>
                        {highlightMatch(result.activity)}
                      </CardTitle>
                      {result.isVerified && (
                        <span className="text-blue-500">●</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <h3 className="text-base font-semibold">
                    {highlightMatch(result.location)}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">
                    {highlightMatch(result.preview)}
                  </p>
                  <div className="flex gap-2">
                    {result.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tag === 'club' ? 'default' : 'secondary'}
                        className={`${tag === 'club' ? 'bg-black text-white' : ''} 
                          ${searchQuery && tag.includes(searchQuery.toLowerCase()) ? 'ring-2 ring-yellow-200' : ''}`}
                      >
                        {highlightMatch(tag)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <div className="w-1/2 flex items-center justify-center">
        <p className="text-2xl font-bold">Map</p>
      </div>

      {isFavoritesModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Favorites</h2>
            <button onClick={toggleFavoritesModal} className="text-xl">×</button>
          </div>
          <div className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Activity</p>
                    <p className="text-gray-500">Location</p>
                  </div>
                  <button
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Activity</p>
                    <p className="text-gray-500">Location</p>
                  </div>
                  <button
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Activity</p>
                    <p className="text-gray-500">Location</p>
                  </div>
                  <button
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
          </div>
        </div>
      </div>
    )}


    </div>

    
  );
};

export default SearchInbox;
