import React, { useEffect } from 'react';

export default function Verify() {
  useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5071509145587376';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Verification Page</h1>
    </div>
  );
}