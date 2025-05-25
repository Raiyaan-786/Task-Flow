import React from 'react';
import { Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Managing Partner',
      company: 'Sharma & Associates CA',
      image: 'PS',
      rating: 5,
      text: 'TaskFlow transformed our 15-person firm completely. We went from juggling spreadsheets to having everything organized in one place. Our productivity increased by 60% in just 3 months!',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Senior CA',
      company: 'Kumar Financial Services',
      image: 'RK',
      rating: 5,
      text: "The AI-powered task assignment is a game-changer. It automatically distributes work based on our team's expertise and current workload. Client satisfaction has never been higher.",
    },
    {
      name: 'Meera Patel',
      role: 'Founder',
      company: 'Patel Chartered Accountants',
      image: 'MP',
      rating: 5,
      text: 'As a small firm, budget was our main concern. TaskFlow delivers enterprise features at a fraction of the cost. The ROI was visible within the first month of implementation.',
    },
    {
      name: 'Amit Verma',
      role: 'Operations Head',
      company: 'Verma & Co.',
      image: 'AV',
      rating: 5,
      text: 'The customer management feature helped us maintain better relationships with our clients. Automated follow-ups and detailed interaction history made all the difference.',
    },
    {
      name: 'Sunita Joshi',
      role: 'Partner',
      company: 'Joshi Financial Consultancy',
      image: 'SJ',
      rating: 5,
      text: 'Setting up TaskFlow was incredibly easy. The guided onboarding and data import saved us weeks of manual work. Our team was up and running in just one day.',
    },
    {
      name: 'Vikram Singh',
      role: 'Founding Partner',
      company: 'Singh & Partners CA',
      image: 'VS',
      rating: 5,
      text: "The analytics dashboard gives us insights we never had before. We can now identify bottlenecks, optimize workflows, and make data-driven decisions for our firm's growth.",
    },
  ];

  return (
    <section id="testimonials" className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-text-center">
          <Typography variant="h1" fontWeight={700} mb={2} className="testimonial-section-title">
            What CA Firms Are <span className="testimonial-gradient-text">Saying About Us</span>
          </Typography>
          <Typography variant="h4" className="testimonial-section-subtitle">
            Join thousands of CA professionals who have transformed their practice with TaskFlow
          </Typography>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-card-content">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="testimonial-star" />
                  ))}
                </div>
                <Typography variant="h5" mb={3} className="testimonial-text">
                  "{testimonial.text}"
                </Typography>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.image}</div>
                  <div>
                    <Typography variant="h5" className="testimonial-name">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="h6" className="testimonial-role">
                      {testimonial.role}
                    </Typography>
                    <Typography variant="h6" className="testimonial-company">
                      {testimonial.company}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-trust-badges">
          <Typography variant="h4" pb={3} className="testimonial-trust-text">
            Trusted by leading CA firms across India
          </Typography>
          <div className="testimonial-badges">
            <Typography variant="h3" className="testimonial-badge">
              CA FIRM 1
            </Typography>
            <Typography variant="h3" className="testimonial-badge">
              CA FIRM 2
            </Typography>
            <Typography variant="h3" className="testimonial-badge">
              CA FIRM 3
            </Typography>
            <Typography variant="h3" className="testimonial-badge">
              CA FIRM 4
            </Typography>
            <Typography variant="h3" className="testimonial-badge">
              CA FIRM 5
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;