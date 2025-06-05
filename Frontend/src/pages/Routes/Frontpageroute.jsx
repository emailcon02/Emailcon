import React, { useState } from "react";
import FeaturedApps from "../../component/Frontpage/FeatureApp";
import Partner from "../../component/Frontpage/Partner";
import Future from "../../component/Frontpage/Future";
import Pricing from "../../component/Frontpage/Pricing";
import Footer from "../../component/Frontpage/Footer";
import FadeInSection from "../../component/Frontpage/FadeInSection";
import FeatureSection from "../../component/Frontpage/FeatureSection";
import NavbarBanner from "../../component/Frontpage/NavbarBanner";
import BookDemo from "../../component/Frontpage/BookDemo";
import FormModal from "../../component/Frontpage/Form";

function Frontpageroute() {
    const [showFormModal, setShowFormModal] = useState(false);

  return (
    <>
    <div className="App">
      <div id="home">
        <NavbarBanner onOpenModal={() => setShowFormModal(true)}/>
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
        <Footer onOpenModal={() => setShowFormModal(true)}/>
      </div>
        <div>
          <BookDemo onOpenModal={() => setShowFormModal(true)} />
        </div>
    </div>
       {/* Modal */}
      {showFormModal && (
        <FormModal onClose={() => setShowFormModal(false)} />
      )}     
    </>
  );
}

export default Frontpageroute;
