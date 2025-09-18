
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, Sun, Cloud, Droplet, Wind } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_KEY = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
const CITIES = ["London", "New York", "Tokyo", "Paris", "Sydney"];

export default function WeatherForecast() {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface WeatherData {
    city: string;
    current: {
      temp: number;
      feels_like: number;
      humidity: number;
      wind_speed: number;
      weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
      }>;
    };
    forecast: Array<{
      dt: number;
      main: {
        temp: number;
        feels_like: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
      }>;
    }>;
  }

  const fetchWeather = async (selectedCity: string) => {
    setError(null);
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentRes.ok || !forecastRes.ok) throw new Error("Failed to fetch weather data");

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      const groupedForecast = forecastData.list
        .filter((_: any, idx: number) => idx % 8 === 0) // Get daily forecasts
        .slice(0, 5) // Limit to 5 days
        .map(item => ({
          dt: item.dt,
          main: {
            temp: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max
          },
          weather: item.weather
        }));

      setWeatherData({
        city: currentData.name,
        current: {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          humidity: currentData.main.humidity,
          wind_speed: currentData.wind.speed,
          weather: currentData.weather
        },
        forecast: groupedForecast
      });
    } catch (err) {
      setError("Failed to load weather data. Please check city name and internet connection.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const getIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "01d": <Sun className="h-8 w-8 text-yellow-500" />,
      "01n": <Moon className="h-8 w-8 text-gray-500" />,
      "02d": <Cloud className="h-8 w-8 text-blue-400" />,
      "02n": <Cloud className="h-8 w-8 text-gray-400" />,
      "03d": <Cloud className="h-8 w-8 text-gray-400" />,
      "03n": <Cloud className="h-8 w-8 text-gray-400" />,
      "04d": <Cloud className="h-8 w-8 text-gray-500" />,
      "04n": <Cloud className="h-8 w-8 text-gray-500" />,
      "09d": <Droplet className="h-8 w-8 text-blue-500" />,
      "09n": <Droplet className="h-8 w-8 text-blue-500" />,
      "10d": <Droplet className="h-8 w-8 text-blue-500" />,
      "10n": <Droplet className="h-8 w-8 text-blue-500" />,
      "11d": <CloudRain className="h-8 w-8 text-cyan-500" />,
      "11n": <CloudRain className="h-8 w-8 text-cyan-500" />,
      "13d": <Snow className="h-8 w-8 text-blue-300" />,
      "13n": <Snow className="h-8 w-8 text-blue-300" />,
      "50d": <Fog className="h-8 w-8 text-gray-400" />,
      "50n": <Fog className="h-8 w-8 text-gray-400" />
    };

    // Fallback icon if code not found
    return iconMap[iconCode] || <Cloud className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="space-y-6 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {city} <span className="ml-1">▾</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {CITIES.map((c) => (
            <DropdownMenuItem key={c} onClick={() => setCity(c)}>
              {c}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !weatherData ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded" />
          <Skeleton className="h-12 rounded" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded" />
            ))}
          </div>
        </div>
      ) : weatherData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{weatherData.city}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {getIcon(weatherData.current.weather[0].icon)}
                <div className="text-4xl font-bold">{Math.round(weatherData.current.temp)}°C</div>
                <div className="text-muted-foreground capitalize">{weatherData.current.weather[0].description}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Feels like</div>
                    <div>{Math.round(weatherData.current.feels_like)}°C</div>
                  </div>
                  <div>
                    <div className="font-medium">Humidity</div>
                    <div>{weatherData.current.humidity}%</div>
                  </div>
                  <div>
                    <div className="font-medium">Wind</div>
                    <div>{weatherData.current.wind_speed} m/s</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  {getIcon(day.weather[0].icon)}
                  <div className="text-xl font-medium">{Math.round(day.main.temp)}°C</div>
                  <div className="text-xs capitalize text-muted-foreground">
                    {day.weather[0].description}
                  </div>
                  <div className="text-xs mt-1">
                    {Math.round(day.main.temp_min)}° / {Math.round(day.main.temp_max)}°
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
