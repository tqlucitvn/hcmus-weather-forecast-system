import { useEffect, useState } from "react";

export default function LocationAndDate({ data }) {
  const [locationData, setLocationData] = useState("Tan Binh district");

  useEffect(() => {
    (async () => {
      await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${
          import.meta.env.VITE_LOCATIONIQ_API_KEY
        }&lat=${data.latitude}&lon=${data.longitude}&format=json`
      ).then(async (res) => {
        const response = await res.json();
        setLocationData(response);
      });
    })();
  }, [data]);

  return (
    <div className="location-and-date">
      <h1 className="location-and-date__location">
        {locationData.display_name}
      </h1>
      <div>{data.time}</div>
    </div>
  );
}
