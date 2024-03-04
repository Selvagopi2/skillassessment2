import React, { useState, useEffect } from "react";
import './WeatherApp.css'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

const api = {
  key : '54000c77133115d42eda4c87fc1ed446',
  base: 'https://api.openweathermap.org/data/2.5/'
}

function WeatherApp() {
  const [search, setSearch] = useState("")
  const [weatherData, setWeatherData] = useState({});
  const [unit, setUnit] = useState('metric');
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);


  useEffect(() => {
    if (search.trim() !== '') {
      searchPressed();
    }
  }, [search, unit]);

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then((result) => {
        if (result.cod === 200) {
          if (unit === 'imperial') {
            result.main.temp = (result.main.temp * 9 / 5) + 32;
          }
          setWeatherData(result);
          setError(null);
          const newSearch = {
            city: result.name,
            weather: result.weather[0].main,
            temp: result.main.temp.toFixed(2),
            unit: unit === 'metric' ? '°C' : '°F'
          };
          if (!recentSearches.find(item => item.city === newSearch.city)) {
            setRecentSearches([newSearch, ...recentSearches]);
          }
        } else {
          setError("City not found. Please enter a valid city name.");
          setWeatherData({});
        }
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        setError('Error fetching weather data. Please try again later.');
        setWeatherData({});
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      searchPressed();
    }
  };

  const handleToggle = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));


  return (
    <div className="App">
      <h1>Weather App</h1>
      <input 
      type="text" 
      placeholder="Enter city name" 
      onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchPressed}>Search</button>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="formSwitch">
          <Form.Check 
            type="switch"
            id="custom-switch"
            label="celsius to fahrenheit"
            checked={unit === 'imperial'}
            onChange={handleToggle}
          />
        </Form.Group>
      </Form>
      <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
      Recent Searches
    </Dropdown.Toggle>

        <Dropdown.Menu>
          {recentSearches.map((search, index) => (
            <Dropdown.Item key={index} onClick={() => setSearch(search.city)}>
              {search.city}, {search.temp} {search.unit}, {search.weather}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {error && <p>{error}</p>}
      {weatherData.name && (
        <div>
          <p>City: {weatherData.name}</p>
          {weatherData.main && <p>Current Temperature: {weatherData.main.temp.toFixed(2)} {unit === 'metric' ? '°C' : '°F'}</p>} 
          {weatherData.weather && weatherData.weather.length > 0 && (
            <p>Weather Conditions: {weatherData.weather[0].main}</p>
          )}
          {weatherData.wind && <p>Wind Speed: {weatherData.wind.speed} m/s</p>}
        </div>
      )}
    </div>
  )
}

export default WeatherApp;

