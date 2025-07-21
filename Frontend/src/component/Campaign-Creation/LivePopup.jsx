import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig";
import "./LivePopup.css";

const LivePopup = ({ userId }) => {
  const [popupActivity, setPopupActivity] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [campaignMap, setCampaignMap] = useState([]); // Store all campaigns

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${userId}?t=${Date.now()}`);
      const sorted = res.data.sort((a, b) => new Date(b.senddate) - new Date(a.senddate));
      setCampaignMap(sorted); // store all
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  };

  // Fetch activity for all campaigns
  const fetchAllActivity = async () => {
    const allActivity = [];

    await Promise.all(
      campaignMap.map(async (campaign) => {
        try {
          const [openRes, clickRes] = await Promise.all([
            axios.get(`${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${userId}&campaignId=${campaign._id}`),
            axios.get(`${apiConfig.baseURL}/api/stud/get-click?userId=${userId}&campaignId=${campaign._id}`),
          ]);

          const opens = (openRes.data.emails || []).map((item) => ({
            type: "open",
            emailId: item.emailId,
            timestamp: new Date(item.timestamp).getTime(),
            campaignName: campaign.campaignname || "Unnamed Campaign",
          }));

          const clicks = [];
          (clickRes.data.urls || []).forEach((url) => {
            (url.clicks || []).forEach((click) => {
              clicks.push({
                type: "click",
                emailId: click.emailId,
                timestamp: new Date(click.timestamp).getTime(),
                campaignName: campaign.campaignname || "Unnamed Campaign",
              });
            });
          });

          allActivity.push(...opens, ...clicks);
        } catch (err) {
          console.error("Activity fetch failed for campaign", campaign._id, err);
        }
      })
    );

    return allActivity.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Initial fetch of campaigns
  useEffect(() => {
    if (userId) fetchCampaigns();
  }, [userId]);

  // Refresh activity every 8 seconds
  useEffect(() => {
    if (!campaignMap.length) return;

    const interval = setInterval(async () => {
      const activities = await fetchAllActivity();
      const latest = activities[0];

      if (
        latest &&
        (!popupActivity || latest.timestamp > popupActivity.timestamp)
      ) {
        setPopupActivity(latest);
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // hide after 3s
    }, 8000);

    return () => clearInterval(interval);
  }, [campaignMap, popupActivity]);

  return (
    <>
      {showPopup && popupActivity && (
        <div className="join-popup">
          <div className="join-popup-content">
            <div className="join-popup-avatar">👤</div>
            <div className="join-popup-text">
              <p>
                <strong>{popupActivity.emailId}</strong>
              </p>
              <p>
                just {popupActivity.type === "open" ? "opened" : "clicked"}{" "}
                from <strong>{popupActivity.campaignName}</strong> campaign!
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
