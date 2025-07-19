import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig";
import "./LivePopup.css";

const LivePopup = ({ userId }) => {
  const [popupActivity, setPopupActivity] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [emailData, setEmailData] = useState([]);
  const [clickedUrls, setClickedUrls] = useState([]);
  const [campaignId, setCampaignId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // fetch latest campaign ID and name
  const fetchLatestCampaign = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.baseURL}/api/stud/campaigns/${userId}?t=${Date.now()}`
      );
      const sorted = res.data.sort(
        (a, b) => new Date(b.senddate) - new Date(a.senddate)
      );
      const latest = sorted[0];
      if (latest) {
        setCampaignId(latest._id);
        setCampaignName(latest.campaignname || "Unnamed Campaign");
      }
    } catch (err) {
      console.error("Failed to fetch latest campaign", err);
    }
  };

  // fetch open & click data
  const fetchActivityData = async (id) => {
    try {
      const [openRes, clickRes] = await Promise.all([
        axios.get(
          `${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${userId}&campaignId=${id}`
        ),
        axios.get(
          `${apiConfig.baseURL}/api/stud/get-click?userId=${userId}&campaignId=${id}`
        ),
      ]);
      setEmailData(openRes.data.emails || []);
      setClickedUrls(clickRes.data.urls || []);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    }
  };

  const getLatestActivity = () => {
    const opens = emailData.map((item) => ({
      type: "open",
      emailId: item.emailId,
      timestamp: new Date(item.timestamp),
    }));

    const clicks = [];
    clickedUrls.forEach((url) => {
      url.clicks.forEach((click) => {
        clicks.push({
          type: "click",
          emailId: click.emailId,
          timestamp: new Date(click.timestamp),
        });
      });
    });

    const all = [...opens, ...clicks].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    return all[0] || null;
  };

  // First load: get latest campaign
  useEffect(() => {
    if (!userId) return;
    fetchLatestCampaign();
  }, [userId]);

  // After getting campaignId, load activity data
  useEffect(() => {
    if (!campaignId) return;
    fetchActivityData(campaignId);
  }, [campaignId]);

  // Show popup every 13s, hide it after 3s
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = getLatestActivity();
      if (
        latest &&
        (!popupActivity || latest.timestamp > popupActivity.timestamp)
      ) {
        setPopupActivity({ ...latest, campaignName }); // new data
      }
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000); // hide after 4s
    }, 8000);

    return () => clearInterval(interval);
  }, [emailData, clickedUrls, popupActivity]);

  // Refresh data every 30s (optional)
  useEffect(() => {
    const refresh = setInterval(() => {
      if (campaignId) fetchActivityData(campaignId);
    }, 30000);
    return () => clearInterval(refresh);
  }, [campaignId]);

  return (
    <>
      {showPopup && popupActivity && (
        <div className="join-popup">
          <div className="join-popup-content">
<div className="join-popup-avatar">
  👤
  
</div>
            <div className="join-popup-text">
              <p>
                <strong>{popupActivity.emailId}</strong>
              </p>
              <p>
                just {popupActivity.type === "open" ? "opened" : "clicked"}{" "} from <strong>{popupActivity.campaignName}</strong> campaign!
              </p>
              
            </div>
            <span className="live-pulse-wrapper">
    <span className="live-pulse-circle"></span>
    <span className="live-pulse-dot"></span>
  </span>
          </div>
        </div>
      )}
    </>
  );
};

export default LivePopup;
