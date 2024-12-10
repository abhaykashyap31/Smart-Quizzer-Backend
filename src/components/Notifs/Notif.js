import React, { useState } from 'react';
import { FaInbox, FaEnvelope, FaBell, FaStar, FaFileAlt, FaDownload } from 'react-icons/fa';
import "./Notif.css";

const Notifs = () => {
  const [activeTab, setActiveTab] = useState('all-messages');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    {
      id: 1,
      sender: 'Dr. Emily Smith',
      time: '2 hours ago',
      preview: 'Feedback received from John Doe regarding recent quiz...',
      isUnread: true,
      badgeCount: 2,
      body: `Dear Dr. Smith,
              I wanted to provide some feedback about the recent quiz. While I appreciate the comprehensive coverage of the material, I found some of the questions to be challenging and potentially outside the scope of our recent lectures. 
              Specifically, question 7 on the quantum mechanics section seemed to require knowledge beyond what we've discussed in class. I would appreciate some clarification on this.
              Best regards, John Doe`,
      attachments: [
        { name: 'Quiz_Feedback.pdf', size: '256 KB' }
      ]
    },
    {
      id: 2,
      sender: 'Quiz System',
      time: 'Yesterday',
      preview: 'New quiz assignment created for Computer Science class...',
      isUnread: false,
      badgeCount: 0,
      body: `New quiz assignment is now available. Please check the portal for details.`,
      attachments: []
    },
    {
      id: 3,
      sender: 'John Doe',
      time: '3 days ago',
      preview: 'Submitted feedback about recent course material...',
      isUnread: false,
      badgeCount: 0,
      body: `I have submitted my feedback regarding the recent course material. Please review it.`,
      attachments: []
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="inbox-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Inbox</h2>
        <ul className="inbox-tabs">
          <li>
            <button
              className={activeTab === 'all-messages' ? 'active' : ''}
              onClick={() => handleTabChange('all-messages')}
            >
              <FaInbox /> All Messages
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'feedbacks' ? 'active' : ''}
              onClick={() => handleTabChange('feedbacks')}
            >
              <FaEnvelope /> Feedbacks
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'notifications' ? 'active' : ''}
              onClick={() => handleTabChange('notifications')}
            >
              <FaBell /> Notifications
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'important' ? 'active' : ''}
              onClick={() => handleTabChange('important')}
            >
              <FaStar /> Important
            </button>
          </li>
        </ul>
      </div>
      <div className="inbox-content">
        <ul className="message-list">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`message-item ${message.isUnread ? 'message-unread' : ''}`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="read-marker"></div>
              <img
                src="/api/placeholder/50/50"
                alt="Avatar"
                className="message-avatar"
              />
              <div className="message-details">
                <div className="message-header">
                  <span className="message-name">{message.sender}</span>
                  <span className="message-time">{message.time}</span>
                </div>
                <div className="message-preview">{message.preview}</div>
              </div>
              <div className="message-actions">
                {message.badgeCount > 0 && <div className="message-badge">{message.badgeCount}</div>}
              </div>
            </li>
          ))}
        </ul>

        {selectedMessage && (
          <div className="message-detail-view">
            <h3 className="message-subject">Feedback from {selectedMessage.sender}</h3>
            <div className="message-body">
              <p>{selectedMessage.body}</p>
            </div>
            {selectedMessage.attachments.length > 0 && (
              <div className="message-attachments">
                {selectedMessage.attachments.map((attachment, index) => (
                  <div className="attachment-item" key={index}>
                    <FaFileAlt className="attachment-icon" />
                    <div className="attachment-details">
                      <strong>{attachment.name}</strong>
                      <div>{attachment.size}</div>
                    </div>
                    <FaDownload />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifs;
