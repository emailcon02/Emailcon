import React from 'react';
import "./Privacypolicy.css";
import { Link } from 'react-router-dom';
import Footerpolicy from './Footerpolicy';
import { faArrowLeft, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Privacypolicy() {
  return (
    <>
      <nav className="privacy-navbar">
        <div className="privacy-navbar-heading">
          Privacy & <span style={{color: "#f48c06"}}>Security</span>
        </div>
        <Link to="/" className="privacy-navbar-back-btn">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
          Back to Home
        </Link>
      </nav>

      <div className='privacy-policy'>
        <div className="policy-header">
          <h3>PRIVACY POLICY</h3>
        </div>

        <section className="policy-intro">
          <h4>Our Commitment to Your Privacy</h4>
          <p>
            Welcome to Imagecon India Private Limited ("we", "our", "us", or the "Company"). 
            Your privacy is of utmost importance to us, and we are committed to protecting 
            your personal information while providing you with a seamless and secure online experience.
          </p>
          <p>
            This Privacy Policy ("Policy") explains how we collect, use, disclose, and safeguard 
            your information when you visit our website (the "Site") or use our services. 
            Please read this Policy carefully. By accessing or using our Site, you agree to 
            the terms of this Policy.
          </p>
        </section>

        <section className="information-collection">
          <h4>1. Information We Collect</h4>
          <p>We collect several types of information to provide and improve our services:</p>
          
          <h5>1.1 Personal Information</h5>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, contact details when you register</li>
            <li><strong>Payment Details:</strong> Billing information for premium services (processed securely)</li>
            <li><strong>Communications:</strong> Records of your inquiries and our responses</li>
          </ul>

          <h5>1.2 Technical Data</h5>
          <ul>
            <li>IP addresses, browser type, device information</li>
            <li>Usage patterns and interaction with our Site</li>
            <li>Cookies and similar tracking technologies (see our Cookie Policy)</li>
          </ul>
        </section>

        <section className="gmail-data">
          <h4>2. Use of Gmail Data (If Connected)</h4>
          <p>
            For users who choose to connect their Gmail account to our services, we implement 
            strict protocols to ensure your email data remains secure and private:
          </p>
          
          <div className="data-protection">
            <h5>2.1 Scope of Access</h5>
            <p>We only access what's necessary to provide our services:</p>
            <ul>
              <li>Email content (including attachments) for campaign management</li>
              <li>Headers and metadata for proper email organization</li>
              <li>Account settings to ensure correct service configuration</li>
            </ul>

            <h5>2.2 Data Protection Measures</h5>
            <ul>
              <li><strong>Encryption:</strong> All data transmissions are encrypted using TLS 1.2+</li>
              <li><strong>Limited Retention:</strong> We only store data as long as necessary</li>
              <li><strong>Access Controls:</strong> Strict internal protocols for data handling</li>
            </ul>

            <h5>2.3 Human Access Restrictions</h5>
            <p>Our employees will never access your Gmail content except:</p>
            <ul className="sub-list">
              <li>When you explicitly grant permission for specific support needs</li>
              <li>To investigate potential security incidents or abuse reports</li>
              <li>When legally required to comply with valid court orders</li>
              <li>For internal analytics in aggregated, anonymized formats</li>
            </ul>
          </div>
        </section>

        <section className="data-usage">
          <h4>3. How We Use Your Information</h4>
          <p>We use collected information responsibly to:</p>
          <ul>
            <li>
              <strong>Provide Services:</strong> Operate, maintain, and improve platform functionality
            </li>
            <li>
              <strong>Communicate:</strong> Send important account updates and service notifications
            </li>
            <li>
              <strong>Enhance Security:</strong> Detect and prevent fraudulent activity
            </li>
            <li>
              <strong>Legal Compliance:</strong> Meet regulatory requirements and respond to legal requests
            </li>
            <li>
              <strong>Customer Support:</strong> Resolve issues and improve user experience
            </li>
          </ul>
        </section>

        <section className="data-sharing">
          <h4>4. Information Sharing</h4>
          <p>We value your trust and only share data when absolutely necessary:</p>
          <ul>
            <li><strong>Service Providers:</strong> Trusted partners who assist in delivering our services (under strict confidentiality agreements)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            <li><strong>With Your Consent:</strong> For any purpose you explicitly authorize</li>
          </ul>
          <p className="note">
            Note: We never sell your personal information to third parties.
          </p>
        </section>

        <section className="user-rights">
          <h4>5. Your Privacy Rights</h4>
          <p>You have control over your information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update inaccurate information</li>
            <li><strong>Deletion:</strong> Request removal of your data (subject to legal requirements)</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@imageconindia.com.
          </p>
        </section>

        <section className="policy-updates">
          <h4>6. Policy Updates</h4>
          <p>
            We may update this Policy periodically. We'll notify you of significant changes 
            through email or prominent notices on our Site. Your continued use after updates 
            constitutes acceptance of the revised Policy.
          </p>
        </section>

        <section className="contact-info">
          <h4>7. Contact Us</h4>
          <p>
            For any privacy-related questions or concerns, please reach out:
          </p>
                 <div className="footer-section">
                  <h6>Contact</h6>
                  <p>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                    +91-8667238830
                  </p>
                  <h6>Email</h6>
                  <p>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                    <a href="mailto:support@atts.in">support@emailcon.in</a>
                  </p>
                </div>
        </section>
      </div>
      <Footerpolicy/>
    </>
  );
}

export default Privacypolicy;