import React, { useState, useEffect } from "react";

function AlarmSetting({ data }) {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [exceededHumidity, setExceededHumidity] = useState(false);
  const [exceededTemperature, setExceededTemperature] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  useEffect(() => {
    if (data.humidity > parseFloat(text2)) {
      setExceededHumidity(true);
      sendAlert();
    } else {
      setExceededHumidity(false);
    }
    if (data.humidity > parseFloat(text1)) {
      setExceededTemperature(true);
      sendAlert();
    } else {
      setExceededTemperature(false);
    }
  }, [data.current_weather.temperature, text1, data.humidity, text2]);

  const sendAlert = () => {
    const alertText = `ALERT - Humidity exceeded ${text2}%: ${data.humidity}% %0AALERT - Temperature exceeded ${text1}: ${data.current_weather.temperature}`;
    const token = "6851377588:AAGzCAP_u9sMlwrMhY7txkfO9NRc7BKfNMs";
    const chat_id = -4072959040;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${alertText}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();

    console.log("Alert message sent!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const my_text = `-Limit of temparature: ${text1}  %0A-Limit of humidity: ${text2}% %0A-Humidity: ${data.humidity}%  %0A-Temperature: ${data.current_weather.temperature}`;
    const token = "6851377588:AAGzCAP_u9sMlwrMhY7txkfO9NRc7BKfNMs";
    const chat_id = -4072959040;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();

    setShowPopup(false);
    console.log("Message successfully sent!");
  };

  return (
    <div className="wrapper">
      <br />
      <div>
        <button className="setting" onClick={togglePopup}>
          Alarm Setting
        </button>
        {showPopup && (
          <div className="popup">
            <div className="popup_inner">
              <div className="form">
                <label htmlFor="limitTemperature">
                  Set temparature limit value
                  <br />
                </label>
                <input
                  type="number"
                  className="form-color"
                  id="limitTemperature"
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                />
              </div>
              <div className="form">
                <label htmlFor="limitHumidity">
                  Set humidity limtie value
                  <br />
                </label>
                <input
                  type="number"
                  className="form-color"
                  id="limitHumidity"
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                />
              </div>
              <button type="button" className="btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btn-close" onClick={togglePopup}>
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlarmSetting;
