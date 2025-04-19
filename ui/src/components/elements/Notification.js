import React, { useState } from "react";

const Notification = ({ defaultEnabled = true }) => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(defaultEnabled);
  const [alertFrequency, setAlertFrequency] = useState("daily");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newKeyword = inputValue.trim();

      if (!keywords.includes(newKeyword.toLowerCase())) {
        setKeywords([...keywords, newKeyword]);
      }

      setInputValue("");
    }
  };

  const removeKeyword = (index) => {
    const updated = [...keywords];
    updated.splice(index, 1);
    setKeywords(updated);
  };
  return (
    <div className="d-flex flex-column align-items-start mb-4">
      <h3>Notification</h3>
      <div className="text-muted mb-2">Get real-time updates</div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="realtimeSwitch"
          checked={notificationsEnabled}
          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
        />
        <label className="form-check-label" htmlFor="realtimeSwitch">
          Enable notifications
        </label>
      </div>

      {notificationsEnabled && (
        <>
          <div className="mb-3">
            <strong>Alert frequency</strong>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="frequency"
                id="daily"
                value="daily"
                checked={alertFrequency === "daily"}
                onChange={() => setAlertFrequency("daily")}
              />
              <label className="form-check-label" htmlFor="daily">
                Daily
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="frequency"
                id="weekly"
                value="weekly"
                checked={alertFrequency === "weekly"}
                onChange={() => setAlertFrequency("weekly")}
              />
              <label className="form-check-label" htmlFor="weekly">
                Weekly
              </label>
            </div>
          </div>

          <div className="mb-3 w-100">
            <label htmlFor="keywords" className="form-label fw-semibold">
              Keywords to get updates on IP asset
            </label>
            <input
              type="text"
              className="form-control"
              id="keywords"
              placeholder="Type keyword and press enter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddKeyword}
            />
            <div className="mt-2 d-flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="badge bg-primary d-flex align-items-center"
                >
                  {keyword}
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm ms-2"
                    aria-label="Remove"
                    onClick={() => removeKeyword(index)}
                    style={{ fontSize: "0.6rem" }}
                  ></button>
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
