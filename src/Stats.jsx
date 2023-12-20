function stats({ data }) {
  return (
    <div className="current-stats">
      <div>
        <div className="current-stats__value">
          {Math.round(data.daily.temperature_2m_max[0])}&deg;
        </div>
        <div className="current-stats__label">High</div>
        <div className="current-stats__value">
          {Math.round(data.daily.temperature_2m_min[0])}&deg;
        </div>
        <div className="current-stats__label">Low</div>
      </div>
      <div>
        <div className="current-stats__value">
          {Math.round(data.wind_spedd)}mph
        </div>
        <div className="current-stats__label">Wind</div>
        <div className="current-stats__value">{data.windspeed}mm</div>
        <div className="current-stats__label">Rain</div>
      </div>
      <div>
        <div className="current-stats__value">
          {data.daily.sunrise[0].slice(-5)}
        </div>
        <div className="current-stats__label">Sunrise</div>
        <div className="current-stats__value">
          {data.daily.sunset[0].slice(-5)}
        </div>
        <div className="current-stats__label">Sunset</div>
      </div>
      <div>
        <div className="current-stats__value">{data.humidity}%</div>
        <div className="current-stats__label">Humidity</div>
        <div className="current-stats__value">{data.cacbon_monoxide}</div>
        <div className="current-stats__label">CO</div>
      </div>
      <div>
        <div className="current-stats__value">{data.lightvalue}</div>
        <div className="current-stats__label">Light</div>
        <div className="current-stats__value">{data.pressure}</div>
        <div className="current-stats__label">Pressure</div>
      </div>
    </div>
  );
}
export default stats;
