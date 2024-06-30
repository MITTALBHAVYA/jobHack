import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import InfoSection from "./InfoSection";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";

const Home = () => {
  const { isAuthorized } = useContext(Context);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="homePage page">
      <HeroSection />
      <InfoSection />
      <PopularCategories />
      <PopularCompanies />
    </section>
  );
};

export default Home;
