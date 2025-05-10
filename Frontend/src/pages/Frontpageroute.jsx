import React from "react";
import NavbarBanner from "../component/Frontpage/NavbarBanner";
import FeaturedApps from "../component/Frontpage/FeatureApp";
import Partner from "../component/Frontpage/Partner";
import Future from "../component/Frontpage/Future";
import Pricing from "../component/Frontpage/Pricing";
import Footer from "../component/Frontpage/Footer";
import FadeInSection from "../component/Frontpage/FadeInSection";
import FeatureSection from "../component/Frontpage/FeatureSection";

function Frontpageroute() {
  return (
    <>
    <div className="App">
      <div id="home">
        <NavbarBanner />
      </div>
      <FadeInSection direction="left" delay={0}>
        <FeatureSection/>
      </FadeInSection>
      <div id="feature">
        <FadeInSection direction="up" delay={0.1}>
          <FeaturedApps />
        </FadeInSection>
      </div>
      
      <FadeInSection direction="left" delay={0.2}>
        <Partner />
      </FadeInSection>
      
      <FadeInSection direction="right" delay={0.3}>
        <Future />
      </FadeInSection>
      
      <div id="Price">
        <FadeInSection direction="down" delay={0.4}>
          <Pricing />
        </FadeInSection>
      </div>
      <div id="contact">
        <Footer />
      </div>
    </div>     
    </>
  );
}

export default Frontpageroute;
