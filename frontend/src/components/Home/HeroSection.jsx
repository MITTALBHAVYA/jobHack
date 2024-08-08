import { FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { useState ,useEffect} from "react";
import { BASE_URL } from "../../../helper.js";
import axios from "axios";
import "./HeroSection.css";

const HeroSection = () => {
  const [counts, setCounts] = useState({
    unexpiredJobsCount: 0,
    jobSeekersCount: 0,
    employersCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/stats/counts`);
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching counts', error);
      }
    };

    fetchCounts();
  }, []);

  const details = [
    {
      id: 1,
      title: counts.unexpiredJobsCount.toLocaleString(),
      subTitle: "Live Jobs",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: counts.jobSeekersCount.toLocaleString(),
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 3,
      title: counts.employersCount.toLocaleString(),
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];

  return (
    <div className="heroSection">
      <div className="container">
        <div className="title">
          <h1>Find a job that suits</h1>
          <h1>your interests and skills</h1>
          <p>
          Discover your dream job with ease! Our job finding website connects you with top employers, offering personalized job recommendations, resume tips, and application tracking to help you land your ideal position.
          </p>
        </div>
        <div className="image">
          <img src="/heros70.png" alt="Hero Section Background" />
        </div>
      </div>
      <div className="details">
        {details.map((element) => {
          return(
          <div className="card" key={element.id}>
            <div className="icon">{element.icon}</div>
            <div className="content">
              <p>{element.title}</p>
              <p>{element.subTitle}</p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection;
