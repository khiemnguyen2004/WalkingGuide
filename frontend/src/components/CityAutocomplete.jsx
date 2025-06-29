import React, { useState, useEffect, useRef } from 'react';

const CityAutocomplete = ({ value, onChange, placeholder = "Thành phố" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchCities = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Using Nominatim API with focus on Vietnam and cities
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=vn&` +
        `addressdetails=1&` +
        `limit=10&` +
        `featuretype=city&` +
        `accept-language=vi`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Filter and format the results
      const formattedSuggestions = data
        .filter(item => 
          item.type === 'city' || 
          item.type === 'administrative' || 
          item.class === 'place'
        )
        .map(item => {
          const address = item.address;
          let cityName = item.name;
          let province = '';
          let country = 'VN';

          // Extract province/state
          if (address.state) {
            province = address.state;
          } else if (address.province) {
            province = address.province;
          }

          // Format the display name
          if (province) {
            return `${cityName}, ${province}, ${country}`;
          } else {
            return `${cityName}, ${country}`;
          }
        })
        .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates

      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the API call to avoid too many requests
    timeoutRef.current = setTimeout(() => {
      searchCities(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="position-relative">
      <div className="position-relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="form-control mb-2"
          placeholder={placeholder}
          autoComplete="off"
        />
        {loading && (
          <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
      {showSuggestions && (
        <div 
          className="position-absolute w-100 bg-white border rounded shadow-sm" 
          style={{ 
            zIndex: 1000, 
            maxHeight: '200px', 
            overflowY: 'auto',
            top: '100%',
            left: 0
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover-bg-light"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-muted">
              Không tìm thấy thành phố
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete; 