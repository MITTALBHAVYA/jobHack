import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Street 10, Karachi, Pakistan",
      openPositions: 10,
      icon: <FaMicrosoft aria-label="Microsoft" />,
    },
    {
      id: 2,
      title: "Tesla",
      location: "Street 10, Karachi, Pakistan",
      openPositions: 5,
      icon: <SiTesla aria-label="Tesla" />,
    },
    {
      id: 3,
      title: "Apple",
      location: "Street 10, Karachi, Pakistan",
      openPositions: 20,
      icon: <FaApple aria-label="Apple" />,
    },
  ];

  const handleOpenPositions = (company) => {
    console.log(`View open positions for ${company.title}`);
  };

  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>
        <div className="banner">
          {companies.map(({ id, title, location, openPositions, icon }) =>{ 
            return (
            <div className="card" key={id}>
              <div className="content">
                <div className="icon">{icon}</div>
                <div className="text">
                  <p>{title}</p>
                  <p>{location}</p>
                </div>
              </div>
              <button onClick={() => handleOpenPositions({ id, title })}>
                Open Positions {openPositions}
              </button>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
