import React from 'react'
import Header from './Header'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Features from './Features'
import Testimonials from './Testimonials'
import Pricing from './Pricing'
import Footer from './Footer'


const LandingPage = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <Features/>
        <HowItWorks/>
        <Testimonials/>
        <Pricing/>
        <Footer/>
    </div>
  )
}

export default LandingPage