import React, { useRef } from 'react';
//this is used for iframs not requires module federation
export default function NextAppIframe({ route = '/' }) {
  const iframeRef = useRef(null);

  const src = `http://localhost:3003${route}`; // Next app URL

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Next App Remote"
    />
  );
}
