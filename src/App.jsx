import { useState, useEffect } from "react";
import { get, ref } from "firebase/database";
import LocationAndDate from "./LocationAndDate";
import NextDays from "./NextDays";
import Stats from "./Stats";
import Temperature from "./Temperature";
import { firebaseDB } from "./config/firebase";
import "./global.css";
import AlarmSetting from "./AlarmSetting";

export default function App() {
  const [data, setData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const weatherRef = ref(firebaseDB, "weather");
      const firebaseData = await get(weatherRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          }
        })
        .catch((err) => {
          setLoading(false);
          setError("Error fetching FireBase data. Please try again later.");
          console.error(err);
        });

      const webApiData = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${firebaseData.latitude}&longitude=${firebaseData.longitude}&hourly=temperature_2m,rain,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,windspeed_10m_max&current_weather=true&windspeed_unit=mph&timezone=GMT`
      )
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return await response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching WebAPI data. Please try again later.");
        });

      setData({
        ...webApiData,
        ...firebaseData,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <main className="main-container">
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <LocationAndDate
            data={{
              time: new Date().toLocaleString("vn-VN", {
                timeZone: "Asia/BangKok",
              }),
              latitude: data.latitude,
              longitude: data.longitude,
            }}
          />

          <Temperature data={data} />

          <Stats data={data} />
          
          <AlarmSetting data={data}/>

          <NextDays data={data.daily} />
        </>
      )}
    </main>
  );
}
