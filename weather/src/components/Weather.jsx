import React, { useEffect, useState } from 'react';
import "./Weather.css";
import { useRef } from 'react';
import searchicon from "../assets/search.jpg";
import clear from "../assets/sunnyy.png";
import cloud from "../assets/cloudy.png"
import drizzle from "../assets/drizzle.png";
import humidity from "../assets/humidity.png";
import rain from "../assets/rain.jpg";
import snow from "../assets/snow.jpg";
import wind from "../assets/windd.png";
import sea_level from "../assets/sealevel.png";
import pressure from "../assets/pressure.png";

function Weather() {
    const inputRef = useRef();
    const [weather, setWeather] = useState(false);
    
    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02d": cloud,
        "02n": cloud,
        "03d": cloud,
        "03n": cloud,
        "04d": drizzle,
        "04n": drizzle,
        "09d": rain,
        "09n": rain,
        "10d": rain,
        "10n": rain,
        "13d": snow,
        "13n": snow,
    };

    const search = async (city) => {
        if(city === "") {
            alert("Enter city name");
            return;
        }
    try{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
            import.meta.env.VITE_APP_ID
        }`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        const icon = allIcons[data.weather[0].icon]|| clear;

        setWeather({
            humidity: data.main.humidity,
            windspeed: data.wind.speed,
            temperature: Math.floor(data.main.temp),
            sea_level:data.main.sea_level || "N/A",
            pressure:data.main.pressure,
            location: data.name,
            icon: icon,
        });
    }   catch (error) {
        setWeather(false);
        console.error("Error in fetching data");
    }

    };

    useEffect(() => {
        search("New York");
    }, []);
    
  return (
    <div className="weather"> 
        <div className="search-bar">
            <input type="text" name="" placeholder="search" ref={inputRef} />
            <img 
            src={searchicon}
            alt=""
            onClick={() => {
                search(inputRef.current.value);
            }}
             />
            </div>

        {weather ? (
            <>
            <img src={weather.icon} alt="" />
            <p>{weather.temperature}°C</p>
            <p>{weather.location}</p>
            <div>
                <div>
                    <img src={humidity} alt="" />
                    <div>
                        <p>{weather.humidity}</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div>
                    <img src={wind} alt="" />
                    <div>
                        <p>{weather.windspeed}</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
           <div className='sea'>
            <img src={sea_level} alt=""/>
            <p>{weather.sea_level}</p>
            <span>sea level</span>
           </div>
           <div className='pressure'>
           <img src = {pressure} alt=""/>
            <p>{weather.pressure}hPa</p>
            <span>pressure</span>
           </div>
        </>
        ) : (
            <> </>
        )}
      
    </div>
  )
}

export default Weather