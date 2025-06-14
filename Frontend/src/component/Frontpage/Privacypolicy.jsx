import React from 'react';
import "./Privacypolicy.css";
import { Link } from 'react-router-dom';
import Footerpolicy from './Footerpolicy';

function Privacypolicy() {
  return (
    <>
    <nav class="privacy-navbar">
        <div class="privacy-navbar-heading">
          Privacy & <span style={{color: "#f48c06"}}>Security</span>
        </div>
        <Link to="/"  class="privacy-navbar-back-btn">
          <i>&larr;</i> Back
       </Link>
       
      </nav>


    <div className='privacy-policy'>
      <h3>PRIVACY POLICIES</h3>

      <p>
        This website is owned and operated by Imagecon India Private Limited ("we", "our", or "us" or the "Company"). We understand and value your privacy. We want to make your experience online satisfying and safe.
      </p>

      <p>
        This privacy policy (the "Policy") governs information you provide to us or we learn from your use of this web site (the "Site") and constitutes a legal agreement between you, as the user of the Site, and the Company, as the owner of the Site. The Policy will also tell you how we may collect, use, and in some instances share this information. Our policies do not apply to third-party websites that are connected via links to our Site and may differ from other service offerings and you should carefully review the terms of service and this privacy notice before using these services.
      </p>

      <h4>Use of Gmail Data</h4>
      <p>If you grant Emailcon access to your Gmail account data, we will strictly adhere to the following:

</p>
      <ul>
        <li>Access will only be used to read, send, delete, or manage email content (including attachments), headers, metadata, and settings as required to operate our email campaign features and user tools.</li>
        <li>We will not share this data with any third parties unless it's necessary for delivering or enhancing the service, complying with laws, or if our business undergoes a structural change (e.g., acquisition).</li>
        <li>We will never use your Gmail data for advertising or promotional targeting.</li>
        <li>We will not permit human access to your Gmail content except when:
          <ul className="sub-list">
            <li>You have given explicit permission for a specific instance,</li>
            <li>It is required to address security concerns or abuse,</li>
            <li>It is needed to comply with legal requirements,</li>
            <li>Or it is for internal operations, and even then, only in anonymized and aggregated formats.</li>
          </ul>
        </li>
      </ul>

      <h4>How We Use Your Information</h4>
      <ul>
        <li>To operate, maintain, and improve the platform’s functionality and reliability.</li>
        <li>To provide customer support, account updates, and important service-related communications.</li>
        <li>To ensure compliance with terms and conditions agreed between you and Imagecon India Private Limited.</li>
        <li>To identify and prevent fraudulent or harmful behavior.</li>
        <li>To protect your privacy and enforce our privacy and security policies.</li>
        <li>To act when necessary to protect our platform, users, or others from harm.</li>
        <li>To comply with legal obligations or respond to valid legal requests.</li>
        <li>For any additional purpose that you explicitly agree to in advance.</li>
      </ul>
    </div>
    <Footerpolicy/>
    </>
  );
}

export default Privacypolicy;
