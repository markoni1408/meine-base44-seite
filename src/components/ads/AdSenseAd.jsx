import React, { useEffect } from 'react';

export default function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {}
}) {
  const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adsenseId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adsenseId]);

  if (!adsenseId) {
    return null;
  }

  return (
    <div className="adsense-container my-4" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adsenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}