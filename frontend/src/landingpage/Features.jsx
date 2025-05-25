import React from 'react';
import { Typography } from '@mui/material';
import { PeopleOutlined, DescriptionOutlined, BarChartOutlined, AccessTimeOutlined, SecurityOutlined, CheckCircleOutlined } from '@mui/icons-material';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: PeopleOutlined,
      title: 'Employee & Customer Management',
      description: 'Centralized database for all your contacts with detailed profiles, communication history, and automated follow-ups.',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      icon: DescriptionOutlined,
      title: 'Smart Task Tracking',
      description: 'AI-powered task assignment and tracking with automated reminders, deadline management, and progress monitoring.',
      color: '#7c3aed',
      bgColor: '#ede9fe',
    },
    {
      icon: BarChartOutlined,
      title: 'Advanced Analytics',
      description: "Real-time insights into your firm's performance with customizable dashboards and automated reporting.",
      color: '#16a34a',
      bgColor: '#dcfce7',
    },
    {
      icon: AccessTimeOutlined,
      title: 'Time Management',
      description: 'Built-in time tracking, billing automation, and project timeline management for maximum productivity.',
      color: '#ea580c',
      bgColor: '#ffedd5',
    },
    {
      icon: SecurityOutlined,
      title: 'Data Security',
      description: 'Bank-level encryption and compliance with CA industry standards to keep your sensitive data protected.',
      color: '#dc2626',
      bgColor: '#fee2e2',
    },
    {
      icon: CheckCircleOutlined,
      title: 'Consultant Management',
      description: 'Streamlined onboarding, performance tracking, and automated workflow assignment for external consultants.',
      color: '#0d9488',
      bgColor: '#ccfbf1',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="text-center">
          <Typography variant="h1" fontWeight={700} className="section-title">
            Everything Your CA Firm Needs in <span className="gradient-text">One Platform</span>
          </Typography>
          <br />
          <Typography variant="h4" className="section-subtitle">
            Built specifically for small CA and accounting firms. No more juggling multiple <br />tools - TaskFlow handles it all.
          </Typography>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="f-card-header">
                <div className="f-header-content">
                  <div className="icon-circle" style={{ backgroundColor: feature.bgColor }}>
                    <feature.icon style={{ color: feature.color, width: 24, height: 24 }} />
                  </div>
                  <Typography variant="h4" fontWeight={600} className="feature-title">
                    {feature.title}
                  </Typography>
                </div>
              </div>
              <div className="f-card-content">
                <Typography variant="body1" className="feature-description">
                  {feature.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <Typography variant="h1" fontWeight={800} className="stat-value">
                1000+
              </Typography>
              <Typography variant="body1" className="stat-label">
                CA Firms Trust Us
              </Typography>
            </div>
            <div className="stat-item">
              <Typography variant="h1" fontWeight={800} className="stat-value">
                50%
              </Typography>
              <Typography variant="body1" className="stat-label">
                Time Saved
              </Typography>
            </div>
            <div className="stat-item">
              <Typography variant="h1" fontWeight={800} className="stat-value">
                99.9%
              </Typography>
              <Typography variant="body1" className="stat-label">
                Uptime
              </Typography>
            </div>
            <div className="stat-item">
              <Typography variant="h1" fontWeight={800} className="stat-value">
                24/7
              </Typography>
              <Typography variant="body1" className="stat-label">
                Support
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;