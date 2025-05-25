
import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import CustomSurplusAvatars from '../components/CustomSurplusAvatars'; // Assuming this is a custom component for avatar display
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import { Box } from '@mui/material';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-blur-circle top-left"></div>
        <div className="hero-blur-circle top-right"></div>
        <div className="hero-blur-circle bottom-left"></div>
      </div>
      <div className="hero-container">
        <div className="hero-trust-indicator">
          <span className="hero-rocket">🚀</span>
          <span>Trusted by 1000+ CA Firms</span>
        </div>
        <h1 className="hero-headline">
          World's First <span className="hero-highlight">Smart</span><br /> Office Management
        </h1>
        <p className="hero-subheadline">
          Office Management Software that edits, creates, and manages all <br /> in one place.
          <br />
          <span className="hero-tagline">10x Growth. Automated.</span>
        </p>
        <div className="hero-trust-users">
          <CustomSurplusAvatars/>
          <span>Trusted Users</span>
        </div>
        <div className="hero-cta-buttons">
          <Link to="/tenantsignup" className="hero-get-started">
            Get Started for Free <span className="hero-arrow"><ArrowForwardIcon/></span>
          </Link>
          <Link to="/landingpage" className="hero-watch-demo">
            Watch Demo
          </Link>
        </div>
        <p className="hero-no-credit">No credit card required.</p>

        {/* Feature Cards */}
        <div className="hero-feature-cards">
          <div className="hero-feature-card">
            
              <PeopleAltOutlinedIcon fontSize='large' sx={{color:'rgb(147 51 234)',marginBottom:1}}/>
           
            <h3>Employee Management</h3>
            <p>Streamline your team operations</p>
          </div>
          <div className="hero-feature-card">
        
              <DescriptionOutlinedIcon fontSize='large' sx={{color:'rgb(147 51 234)',marginBottom:1}}/>
           
            <h3>Task Tracking</h3>
            <p>Never miss a deadline again</p>
          </div>
          <div className="hero-feature-card">
            <PollOutlinedIcon fontSize='large' sx={{color:'rgb(147 51 234)',marginBottom:1}}/>
            <h3>Analytics</h3>
            <p>Data-driven insights</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;