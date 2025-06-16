import React from 'react';
import "./Privacypolicy.css";
import { Link } from 'react-router-dom';
import Footerpolicy from './Footerpolicy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

function Termsofservice() {
  return (
    <>
      <nav className="privacy-navbar">
        <div className="privacy-navbar-heading">
          Terms of <span style={{color: "#f48c06"}}>Service</span>
        </div>
        <Link to="/" className="privacy-navbar-back-btn">
                      <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />Back
        </Link>
      </nav>

      <div className='privacy-policy'>
        <h3>TERMS OF SERVICE</h3>
        <p className="last-updated">Last Updated: June 10, 2025</p>

        <h4>1. Welcome to Our Services</h4>
        <p>
          Thank you for choosing the website and services (collectively, the "Services") provided by Imagecon India Private Limited ("we," "our," "us," or the "Company"). By accessing or using our website (the "Site") or Services, you agree to these Terms of Service (the "Terms"), which form a legal agreement between you and the Company. We're committed to providing a safe and reliable experience, and these Terms ensure we can do so effectively. If you do not agree with these Terms, please refrain from using the Site or Services.
        </p>
        <p>
          We may update these Terms occasionally to enhance our Services, and your continued use after such updates signifies your acceptance of the revised Terms.
        </p>

        <h4>2. Using Our Services</h4>
        <h5>2.1 Who Can Use Our Services</h5>
        <p>
          To use our Services, you must be at least 18 years old or the legal age of majority in your jurisdiction. By using the Services, you confirm that you meet these requirements and are ready to enjoy what we offer.
        </p>

        <h5>2.2 How to Use Our Services</h5>
        <p>
          We encourage you to use our Services responsibly and for lawful purposes in line with these Terms. To ensure a positive experience for all, you agree not to:
        </p>
        <ul>
          <li>Use the Services in ways that violate applicable laws or regulations.</li>
          <li>Attempt to access unauthorized areas of the Site or Services.</li>
          <li>Introduce malicious code, viruses, or harmful content.</li>
          <li>Disrupt the performance or integrity of the Services.</li>
          <li>Engage in fraudulent or harmful activities.</li>
        </ul>

        <h5>2.3 Your Account</h5>
        <p>
          If you create an account, you're responsible for keeping your login details secure and for any activity under your account. Please notify us immediately if you suspect any unauthorized use of your account. We're here to help keep your account safe.
        </p>

        <h4>3. Gmail Data Access and Usage</h4>
        <p>
          If you choose to connect your Gmail account to our Services, we'll use that access to deliver and improve our email campaign features and user tools. Here's how we handle your Gmail data with care:
        </p>
        <ul>
          <li>
            <strong>What We Access:</strong> We only access email content (including attachments), headers, metadata, and settings needed to provide our Services.
          </li>
          <li>
            <strong>Keeping Data Private:</strong> Your Gmail data stays with us and is only shared if necessary to enhance the Services, comply with legal obligations, or during a business transition (e.g., a merger).
          </li>
          <li>
            <strong>No Ads:</strong> We never use your Gmail data for advertising or promotional purposes.
          </li>
          <li>
            <strong>Limited Human Access:</strong> No one at our Company accesses your Gmail content unless:
            <ul className="sub-list">
              <li>You explicitly allow it for a specific reason.</li>
              <li>It's needed to address security or abuse issues.</li>
              <li>It's required to meet legal obligations.</li>
              <li>It's used internally in anonymized, aggregated forms to improve our Services.</li>
            </ul>
          </li>
        </ul>

        <h4>4. Our Intellectual Property</h4>
        <p>
          The content, features, and tools on our Site and Services, such as text, graphics, logos, and software, belong to Imagecon India Private Limited or our licensors. They're protected by copyright, trademark, and other intellectual property laws. You're welcome to use the Services as intended, but please don't copy, modify, or distribute our content without our written permission, unless allowed by law.
        </p>

        <h4>5. A Seamless Experience</h4>
        <p>
          We've designed our Services to work smoothly and reliably, focusing on delivering value directly to you. Our platform is built to support your needs without relying on external distractions, ensuring a straightforward and enjoyable experience.
        </p>

        <h4>6. Our Responsibility to You</h4>
        <p>
          To the extent permitted by law, Imagecon India Private Limited, including our affiliates, officers, directors, employees, or agents, will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits or data, related to your use of the Services. Our total liability for any claim will not exceed the amount you paid, if any, for the Services in the last 12 months. We're committed to making things right, but this helps us keep our Services sustainable.
        </p>

        <h4>7. Service Guarantees</h4>
        <p>
          We provide the Site and Services "as is" and "as available," striving to ensure they're reliable and secure. However, we can't guarantee the Services will always be uninterrupted or error-free. We're always working to improve, and we appreciate your understanding as we do so.
        </p>

        <h4>8. Ending Our Relationship</h4>
        <p>
          We hope you love using our Services, but we may suspend or end your access if we believe you've violated these Terms, with or without notice. If your access ends, please stop using the Services. You can also choose to stop using the Services at any time.
        </p>

   

        <h4>9. Your Support for Us</h4>
        <p>
          You agree to indemnify and hold harmless Imagecon India Private Limited, our affiliates, officers, directors, employees, and agents from any claims, damages, or expenses (including reasonable attorneys' fees) arising from your use of the Services, violation of these Terms, or infringement of third-party rights. This helps us focus on delivering great Services to you.
        </p>

        <h4>10. Other Important Details</h4>
        <ul>
          <li>
            <strong>Complete Agreement:</strong> These Terms, along with our Privacy Policy, form the full agreement between you and the Company about the Services.
          </li>
          <li>
            <strong>If Something's Invalid:</strong> If part of these Terms isn't enforceable, the rest will still apply.
          </li>
          <li>
            <strong>No Waivers:</strong> If we don't enforce a part of these Terms, it doesn't mean we waive it.
          </li>
          <li>
            <strong>Assignments:</strong> You can't transfer your rights under these Terms without our consent, but we may assign them as needed.
          </li>
        </ul>

        <h4>11. Get in Touch</h4>
        <p>
          We're here to help! If you have questions about these Terms or our Services, please reach out:
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
      </div>
      <Footerpolicy/>
    </>
  );
}

export default Termsofservice;