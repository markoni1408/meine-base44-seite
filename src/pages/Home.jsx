import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import PackagesSection from '../components/home/PackagesSection';
import OpeningHours from '../components/home/OpeningHours';
import AdSenseAd from '../components/ads/AdSenseAd';

export default function Home() {
  useEffect(() => {
    document.title = 'AVANTURA PARK - Dschungel-Abenteuer in Wien';
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdSenseAd 
          adSlot="1234567890"
          adFormat="auto"
          fullWidthResponsive={true}
        />
      </div>
      <PackagesSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdSenseAd 
          adSlot="0987654321"
          adFormat="auto"
          fullWidthResponsive={true}
        />
      </div>
      <OpeningHours />
    </div>
  );
}