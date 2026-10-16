import React, { useState, useEffect, useRef } from "react";
import "./project.css";

import searchicon from "../assets/search.jpg";
import clear from "../assets/sunnyy.png";
import cloud from "../assets/cloudy.png";
import drizzle from "../assets/drizzle.png";
import humidity from "../assets/humidity.png";
import rain from "../assets/rain.jpg";
import snow from "../assets/snow.jpg";
import wind from "../assets/wind.png";
import sea from "../assets/sealevel.png";
import ground from "../assets/ground.png";

function Project() {
    const inputRef = useRef();

    const [weather, setWeather] = useState(false);
    const [time, setTime] = useState("");

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
        if (city === "") {
            alert("Enter city name");
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            console.log(data);

            if (data.cod !== 200) {
                alert("City not found");
                setWeather(false);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear;

            setWeather({
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                sea_level: data.main.sea_level || "N/A",
                grnd_level: data.main.grnd_level || "N/A",
                temperature: Math.floor(data.main.temp),
                location: data.name,
                timezone: data.timezone,
                icon: icon,
            });
        } catch (error) {
            console.error(error);
            setWeather(false);
        }
    };

    // Load default city
    useEffect(() => {
        search("New York");
    }, []);

    // Update time according to the selected city's timezone
    useEffect(() => {
        if (!weather) return;

        const updateCityTime = () => {
            // Current UTC time
            const utc =
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60000;

            // Add the city's timezone offset
            const cityTime = new Date(utc + weather.timezone * 1000);

            setTime(
                cityTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };

        updateCityTime();

        const interval = setInterval(updateCityTime, 1000);

        return () => clearInterval(interval);
    }, [weather]);

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search city"
                    ref={inputRef}
                />

                <img
                    src={searchicon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>

            {weather && (
                <>
                    <img
                        src={weather.icon}
                        alt=""
                        className="weather-icon"
                    />

                    <p className="temperature">
                        {weather.temperature}°C
                    </p>

                    <p className="location">
                        {weather.location}
                    </p>

                    <p className="time">
                        {time}
                    </p>

                    <div className="weather-details">
                        <div className="cool">
                            <img src={humidity} alt="" />

                            <div>
                                <p>{weather.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="cool">
                            <img src={wind} alt="" />

                            <div>
                                <p>{weather.windspeed} m/s</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>

                    <div className="details">
                        <div className="cool">
                            <img src={sea} alt="" />

                            <div>
                                <p>{weather.sea_level}</p>
                                <span>Sea Level</span>
                            </div>
                        </div>

                        <div className="cool">
                            <img src={ground} alt="" />

                            <div>
                                <p>{weather.grnd_level}</p>
                                <span>Ground Level</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Project;