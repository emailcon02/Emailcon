import React, { useState } from "react";
import FeaturedApps from "../../component/Frontpage/FeatureApp";
import Partner from "../../component/Frontpage/Partner";
import Future from "../../component/Frontpage/Future";
import Pricing from "../../component/Frontpage/Pricing";
import Footer from "../../component/Frontpage/Footer";
// import FadeInSection from "../../component/Frontpage/FadeInSection";
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
        <FeatureSection/>
      <div id="feature">
          <FeaturedApps />
      </div>
      
        <Partner />
      
        <Future />
      
      <div id="Price">
          <Pricing />
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
