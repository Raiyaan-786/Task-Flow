import React from 'react';
import { Typography } from '@mui/material';
import { CheckCircleOutline, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '₹999',
      period: 'per month',
      description: 'Perfect for small CA firms getting started',
      features: [
        'Up to 5 team members',
        'Basic task management',
        'Client database (up to 100 clients)',
        'Email support',
        'Basic reporting',
        'Mobile app access',
      ],
      buttonText: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '₹1,999',
      period: 'per month',
      description: 'Most popular for growing CA practices',
      features: [
        'Up to 15 team members',
        'Advanced task automation',
        'Unlimited client database',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom workflows',
        'Time tracking & billing',
      ],
      buttonText: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '₹3,999',
      period: 'per month',
      description: 'For large firms with complex needs',
      features: [
        'Unlimited team members',
        'AI-powered insights',
        'White-label solution',
        '24/7 phone support',
        'Custom integrations',
        'Advanced security',
        'Dedicated account manager',
        'Custom training',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-text-center">
          <Typography variant="h1" fontWeight={700} mb={2} className="pricing-section-title">
            Simple, Transparent <span className="pricing-gradient-text">Pricing</span>
          </Typography>
          <Typography variant="h4" className="pricing-section-subtitle">
            Choose the perfect plan for your CA firm. All plans include a 14-day free trial.
          </Typography>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'pricing-popular' : ''}`}>
              {plan.popular && (
                <div className="pricing-badge">Most Popular</div>
              )}
              <div className="pricing-card-header">
                <Typography variant="h3" fontWeight={700} mb={1} className="pricing-plan-name">
                  {plan.name}
                </Typography>
                <Typography variant="h6" fontWeight={400} mb={1} className="pricing-plan-description">
                  {plan.description}
                </Typography>
                <div className="pricing-price-container">
                  <Typography variant="h1" fontWeight={700} mr={1} className="pricing-price">
                    {plan.price}
                  </Typography>
                  <Typography variant="h5" className="pricing-period">
                    {plan.period}
                  </Typography>
                </div>
              </div>
              <div className="pricing-card-content">
                <ul className="pricing-features-list">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="pricing-feature-item">
                      <CheckCircleOutline className="pricing-check-icon" />
                      <Typography variant="h5" fontWeight={400} className="pricing-feature-text">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
                {plan.name === 'Enterprise' ? (
                  <button className="pricing-button pricing-gradient-button">
                    {plan.buttonText}
                    <ArrowForward className="pricing-arrow-icon" />
                  </button>
                ) : (
                  <Link to="/tenantsignup" className="pricing-link">
                    <button
                      className={`pricing-button ${
                        plan.popular ? 'pricing-gradient-button' : 'pricing-outline-button'
                      }`}
                    >
                      {plan.buttonText}
                      <ArrowForward className="pricing-arrow-icon" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-guarantee-section">
          <div className="pricing-guarantee-card">
            <Typography variant="h3" mb={2} fontWeight={700} className="pricing-guarantee-title">
              30-Day Money Back Guarantee
            </Typography>
            <Typography variant="h5" mb={2} className="pricing-guarantee-description">
              Not satisfied? Get a full refund within 30 days. No questions asked.
            </Typography>
            <div className="pricing-guarantee-features">
              <Typography variant="h6" className="pricing-guarantee-feature">
                ✓ No setup fees
              </Typography>
              <Typography variant="h6" className="pricing-guarantee-feature">
                ✓ Cancel anytime
              </Typography>
              <Typography variant="h6" className="pricing-guarantee-feature">
                ✓ 24/7 support
              </Typography>
              <Typography variant="h6" className="pricing-guarantee-feature">
                ✓ Data export included
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;