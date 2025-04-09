// import React, { useRef } from 'react';
// import { Parallax, ParallaxLayer } from '@react-spring/parallax';
// import asthmaImage from './assets/mapAU.jpg';
// import mapImage from './assets/mapAU.jpg';
// import plantImage from './assets/mapAU.jpg';
// import tipsImage from './assets/mapAU.jpg';
// import './App.css';
// import BlowingDandelion from './assets/blowing-a-dandelion-animate.svg';

// function App() {
//   const parallaxRef = useRef();

//   return (
//     <Parallax pages={5} ref={parallaxRef}>

//       {/* Section 1 - Animated Text & Image Layout */}
// <ParallaxLayer offset={0} speed={0.2} factor={1.5} style={{ backgroundColor: '#f9f9fb' }} />

// <ParallaxLayer offset={0} speed={1}>
//   <div className="section-one-wrapper">
//     <div className="section-one-text">
//       <ParallaxLayer offset={0} speed={0.4}>
//         <h1>New to Victoria?</h1>
//       </ParallaxLayer>
//       <ParallaxLayer offset={0} speed={0.6}>
//         <p>Here’s how you can stay safe and allergy-free this season.</p>
//       </ParallaxLayer>
//       <ParallaxLayer offset={0} speed={0.8}>
//         <button onClick={() => parallaxRef.current.scrollTo(1)}>Scroll down to see more</button>
//       </ParallaxLayer>
//     </div>

//     <div className="section-one-image">
//       <ParallaxLayer offset={0} speed={0.5}>
//         <img src={BlowingDandelion} alt="Dandelion SVG" />
//       </ParallaxLayer>
//     </div>
//   </div>
// </ParallaxLayer>

//       {/* SECTION 2 */}
//       <ParallaxLayer
//         offset={1}
//         speed={0.2}
//         factor={1.5}
//         style={{
//           backgroundImage: `url(${asthmaImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       />
//       <ParallaxLayer offset={1} speed={1}>
//         <div className="content" onClick={() => parallaxRef.current.scrollTo(2)}>
//           <h1>Why This Matters</h1>
//           <p>Data shows increasing cases of hay fever, asthma, and respiratory problems.</p>
//         </div>
//       </ParallaxLayer>

//       {/* SECTION 3 */}
//       <ParallaxLayer
//         offset={2}
//         speed={0.2}
//         factor={1.5}
//         style={{
//           backgroundImage: `url(${mapImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       />
//       <ParallaxLayer offset={2} speed={1}>
//         <div className="content" onClick={() => parallaxRef.current.scrollTo(3)}>
//           <h1>Know the Pollen in Your Area</h1>
//           <p>Find out real-time pollen levels by location and stay ahead of allergens.</p>
//         </div>
//       </ParallaxLayer>

//       {/* SECTION 4 */}
//       <ParallaxLayer
//         offset={3}
//         speed={0.2}
//         factor={1.5}
//         style={{
//           backgroundImage: `url(${plantImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       />
//       <ParallaxLayer offset={3} speed={1}>
//         <div className="content" onClick={() => parallaxRef.current.scrollTo(4)}>
//           <h1>Scan Your Plant</h1>
//           <p>Snap a photo, and we’ll tell you if the plant is allergy-safe or not.</p>
//         </div>
//       </ParallaxLayer>

//       {/* SECTION 5 */}
//       <ParallaxLayer
//         offset={4}
//         speed={0.2}
//         factor={1.5}
//         style={{
//           backgroundImage: `url(${tipsImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       />
//       <ParallaxLayer offset={4} speed={1}>
//         <div className="content">
//           <h1>Prevention Tips</h1>
//           <p>Learn what you can do to stay healthy and reduce allergic reactions.</p>
//         </div>
//       </ParallaxLayer>

//     </Parallax>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import React, { useRef } from 'react';
// import { Parallax, ParallaxLayer } from '@react-spring/parallax';
// import './App.css';
// import BlowingDandelion from './assets/blowing-a-dandelion-animate.svg';
// import NavigationSVG from './assets/navigation-animate.svg';
// import ForestSVG from './assets/forest-animate.svg';
// import ThesisSVG from './assets/thesis-animate.svg';
// import Navbar from './components/Navbar';
// import PollenPage from './pages/PollenPage';

// <Route path="/pollen" element={<PollenPage />} />




// function App() {
//   const parallaxRef = useRef();

//   return (
//     <>
//     <Navbar/>

//     <Parallax pages={5} ref={parallaxRef}>

//       {/* SECTION 1 - Light Background */}
//       <ParallaxLayer offset={0} speed={0} factor={1} style={{ backgroundColor: '#f9f9f9' }} />
//       <ParallaxLayer offset={0} speed={0.2}>
//         <div className="image-layer right">
//           <img src={BlowingDandelion} alt="Dandelion" />
//         </div>
//       </ParallaxLayer>
//       <ParallaxLayer offset={0} speed={0.5}>
//         <div className="text-layer left">
//           <h1 className="section-title">New to Victoria?</h1>
//           <p className="section-subtitle">
//             Here’s how you can stay safe and allergy-free this season.
//           </p>
//           <button onClick={() => parallaxRef.current.scrollTo(1)}>
//             Scroll down to see more
//           </button>
//         </div>
//       </ParallaxLayer>

//       {/* SECTION 2 - Blue Background */}
//       <ParallaxLayer offset={1} speed={0} factor={1} style={{ backgroundColor: '#eaf3ff' }} />
//       <ParallaxLayer offset={1} speed={0.2}>
//         <div className="image-layer left">
//           <img src={NavigationSVG} alt="Navigation" />
//         </div>
//       </ParallaxLayer>
//       <ParallaxLayer offset={1} speed={0.5}>
//         <div className="text-layer right">
//           <h1 className="section-title">Why This Matters</h1>
//           <p className="section-subtitle">
//             Data shows increasing cases of hay fever, asthma, and respiratory problems.
//           </p>
//           <button onClick={() => parallaxRef.current.scrollTo(0)}>
//             Back to Top
//           </button>
//         </div>
//       </ParallaxLayer>

//       {/* SECTION 3 - Forest Theme (Text Right, Image Left) */}
//       <ParallaxLayer offset={2} speed={0} factor={1} style={{ backgroundColor: '#e6ffe6' }} />

//       <ParallaxLayer offset={2} speed={0.2}>
//         <div className="image-layer left">
//           <img src={ForestSVG} alt="Forest Illustration" />
//         </div>
//       </ParallaxLayer>

//       <ParallaxLayer offset={2} speed={0.5}>
//         <div className="text-layer right">
//           <h1 className="section-title">Know the Pollen in Your Area</h1>
//           <p className="section-subtitle">
//             Find out real-time pollen levels by location and stay ahead of allergens.
//           </p>
//           <button onClick={() => parallaxRef.current.scrollTo(3)}>
//             Continue
//           </button>
//         </div>
//       </ParallaxLayer>
//       {/* SECTION 4 - Thesis Theme (Text Left, Image Right) */}
//       <ParallaxLayer offset={3} speed={0} factor={1} style={{ backgroundColor: '#fffde6' }} />

//       <ParallaxLayer offset={3} speed={0.2}>
//         <div className="image-layer right">
//           <img src={ThesisSVG} alt="Thesis Illustration" />
//         </div>
//       </ParallaxLayer>

//       <ParallaxLayer offset={3} speed={0.5}>
//         <div className="text-layer left">
//           <h1 className="section-title">Scan Your Plant</h1>
//           <p className="section-subtitle">
//             Snap a photo, and we’ll tell you if the plant is allergy-safe or not.
//           </p>
//           <button onClick={() => parallaxRef.current.scrollTo(4)}>
//             Final Section
//           </button>
//         </div>
//       </ParallaxLayer>


//     </Parallax>

//     </>
//   );
// }

// export default App;



import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PollenPage from './pages/PollenPage';
import TestPage from './pages/TestPage';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pollen" element={<PollenPage />} />
      </Routes>
    </>
  );
}

export default App;
