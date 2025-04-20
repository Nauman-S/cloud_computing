import { useState } from "react";
import FadeInOutCard from "../elements/FadeInOutCard";
import Login from "../Login";
import { PlanComparisonModal } from "../PlanComparisonModal";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const fadeCardsData = [
    {
      image: <SmartSearchIcon />,
      title: "Smart Search",
      description:
        "Keyword matching and LLM-driven similarity search for precise and context-aware results.",
    },
    {
      image: <ReatTimeAlertIcon />,
      title: "Analytics Dashboard",
      description:
        "View insights on IP assets and monitor competitor activities in real time.",
    },
    {
      image: <AnalyticsIcon />,
      title: "Real-time Alerts",
      description:
        "Set up alerts to monitor new IP filings that match your search preferences.",
    },
  ];
  return (
    <div>
      <div className="landing-section">
        <div className="landing-content">
          <h1>
            Monitor, analyze, and explore <br />
            <span>IP assets</span>
          </h1>
          <p>
            Gain real-time visibility into your IP assets with powerful
            analytics and monitoring tools. Stay ahead with latest innovations.
          </p>
          <button className="me-3" onClick={() => setShowLogin(true)}>
            Start with a free trial
          </button>
          <PlanComparisonModal></PlanComparisonModal>
          <Login showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>
      </div>
      <div className="fade-card-container">
        {fadeCardsData.map((card, index) => (
          <FadeInOutCard
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      {/* TODO:footer */}
      <div className="footer"></div>
    </div>
  );
}

const SmartSearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    stroke="#4A90E2"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="28" cy="28" r="12" />
    <line x1="38" y1="38" x2="58" y2="58" />
    <path d="M20 16l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#4A90E2" />
  </svg>
);

const ReatTimeAlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    stroke="#E53E3E"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M32 6L6 58h52L32 6z" fill="none" />
    <path d="M30 26h8l-6 12h6l-10 16 2-14h-6l6-14z" fill="#E53E3E" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    stroke="#4A90E2"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="4" y="4" width="56" height="40" rx="4" ry="4" />
    <line x1="10" y1="38" x2="10" y2="28" stroke="#D1D5DB" />
    <line x1="20" y1="38" x2="20" y2="18" stroke="#D1D5DB" />
    <line x1="30" y1="38" x2="30" y2="23" stroke="#D1D5DB" />
    <line x1="40" y1="38" x2="40" y2="32" stroke="#D1D5DB" />
    <line x1="50" y1="38" x2="50" y2="27" stroke="#D1D5DB" />
    <path d="M10 28L20 18L30 23L40 32L50 27" fill="none" stroke="#FF5A5F" />
  </svg>
);
