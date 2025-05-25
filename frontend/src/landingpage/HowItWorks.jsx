import React from 'react';
import { Typography } from '@mui/material';
import { PersonAddOutlined, AssignmentOutlined, BarChartOutlined, ArrowForward } from '@mui/icons-material';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: PersonAddOutlined,
      title: 'Setup Your Firm',
      description: 'Quick 5-minute setup with guided onboarding. Import your existing data seamlessly.',
      color: '#2563eb',
      bgColor: 'hiw-bg-blue-100',
    },
    {
      icon: AssignmentOutlined,
      title: 'Create & Assign Tasks',
      description: 'Smart task creation with intelligent assignment based on workload and expertise.',
      color: '#7c3aed',
      bgColor: 'hiw-bg-purple-100',
    },
    {
      icon: BarChartOutlined,
      title: 'Track & Optimize',
      description: "Real-time monitoring with automated insights to boost your firm's productivity.",
      color: '#16a34a',
      bgColor: 'hiw-bg-green-100',
    },
  ];

  return (
    <section id="how-it-works" className="hiw-section">
      <div className="hiw-container">
        <div className="hiw-text-center">
          <Typography variant="h1" fontWeight={700} mb={2} className="hiw-section-title">
            Get Started in <span className="hiw-gradient-text">3 Simple Steps</span>
          </Typography>
          <Typography variant="h4" className="hiw-section-subtitle">
            From setup to optimization, TaskFlow makes it easy to transform your CA firm's operations.
          </Typography>
        </div>

        <div className="hiw-steps-container">
          <div className="hiw-steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="hiw-step-wrapper">
                <div className="hiw-card">
                  <div className="hiw-card-content">
                    <div className="hiw-icon-container">
                      <div className={`hiw-icon-circle ${step.bgColor}`}>
                        <step.icon style={{ color: step.color, width: 32, height: 32 }} />
                      </div>
                      <div className="hiw-step-number">
                        {index + 1}
                      </div>
                    </div>
                    <Typography variant="h4" fontWeight={700} mb={3} className="hiw-step-title">
                      {step.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={300} className="hiw-step-description">
                      {step.description}
                    </Typography>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hiw-arrow-container">
                    <ArrowForward className="hiw-arrow-icon" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-demo-section">
          <div className="hiw-demo-card">
            <Typography variant="h3" fontWeight={600} mb={3} className="hiw-demo-title">
              See TaskFlow in Action
            </Typography>
            <Typography variant="h5" fontWeight={300} mb={3} className="hiw-demo-description">
              Watch how CA firms are transforming their operations with TaskFlow
            </Typography>
            <div className="hiw-demo-video-placeholder">
              <div className="hiw-demo-video-content">
                <div className="hiw-play-button">
                  <ArrowForward className="hiw-play-icon" />
                </div>
                <Typography variant="h4" fontWeight={500} mb={1} className="hiw-demo-video-text">
                  Demo Video Coming Soon
                </Typography>
                <Typography variant="h5" className="hiw-demo-video-subtext">
                  Interactive product walkthrough
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;