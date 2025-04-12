import "./FadeInOutCard.css";
const FadeInOutCard = ({ image, title, description }) => {
  return (
    <div className="fade-card">
      <div className="fade-card-front">
        <div className="fade-card-icon">{image}</div>
        <h3 className="fade-card-title">{title}</h3>
      </div>
      <div className="fade-card-back">
        <h3 className="fade-card-title">{title}</h3>
        <p className="fade-card-description">{description}</p>
      </div>
    </div>
  );
};

export default FadeInOutCard;
