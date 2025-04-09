import React, { useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import BlowingDandelion from '../assets/blowing-a-dandelion-animate.svg';
import NavigationSVG from '../assets/navigation-animate.svg';
import ForestSVG from '../assets/forest-animate.svg';
import ThesisSVG from '../assets/thesis-animate.svg';
import './HomePage.css';

export default function HomePage() {
  const parallaxRef = useRef();

  return (
    <Parallax pages={5} ref={parallaxRef}>
      {/* SECTION 1 - Light Background */}
      <ParallaxLayer offset={0} speed={0} factor={1} style={{ backgroundColor: '#f9f9f9' }} />
      <ParallaxLayer offset={0} speed={0.2}>
        <div className="image-layer right">
          <img src={BlowingDandelion} alt="Dandelion" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={0.5}>
        <div className="text-layer left">
          <h1 className="section-title">New to Victoria?</h1>
          <p className="section-subtitle">
            Here’s how you can stay safe and allergy-free this season.
          </p>
          <button onClick={() => parallaxRef.current.scrollTo(1)}>
            Scroll down to see more
          </button>
        </div>
      </ParallaxLayer>

      {/* SECTION 2 - Blue Background */}
      <ParallaxLayer offset={1} speed={0} factor={1} style={{ backgroundColor: '#eaf3ff' }} />
      <ParallaxLayer offset={1} speed={0.2}>
        <div className="image-layer left">
          <img src={NavigationSVG} alt="Navigation" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer offset={1} speed={0.5}>
        <div className="text-layer right">
          <h1 className="section-title">Why This Matters</h1>
          <p className="section-subtitle">
            Data shows increasing cases of hay fever, asthma, and respiratory problems.
          </p>
          <button onClick={() => parallaxRef.current.scrollTo(0)}>
            Back to Top
          </button>
        </div>
      </ParallaxLayer>

      {/* SECTION 3 - Forest Theme */}
      <ParallaxLayer offset={2} speed={0} factor={1} style={{ backgroundColor: '#e6ffe6' }} />
      <ParallaxLayer offset={2} speed={0.2}>
        <div className="image-layer left">
          <img src={ForestSVG} alt="Forest Illustration" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer offset={2} speed={0.5}>
        <div className="text-layer right">
          <h1 className="section-title">Know the Pollen in Your Area</h1>
          <p className="section-subtitle">
            Find out real-time pollen levels by location and stay ahead of allergens.
          </p>
          <button onClick={() => parallaxRef.current.scrollTo(3)}>
            Continue
          </button>
        </div>
      </ParallaxLayer>

      {/* SECTION 4 - Thesis Theme */}
      <ParallaxLayer offset={3} speed={0} factor={1} style={{ backgroundColor: '#fffde6' }} />
      <ParallaxLayer offset={3} speed={0.2}>
        <div className="image-layer right">
          <img src={ThesisSVG} alt="Thesis Illustration" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer offset={3} speed={0.5}>
        <div className="text-layer left">
          <h1 className="section-title">Scan Your Plant</h1>
          <p className="section-subtitle">
            Snap a photo, and we’ll tell you if the plant is allergy-safe or not.
          </p>
          <button onClick={() => parallaxRef.current.scrollTo(4)}>
            Final Section
          </button>
        </div>
      </ParallaxLayer>
    </Parallax>
  );
}
