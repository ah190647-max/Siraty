import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Analytics() {
  const gaId = 'G-XXXXXXXXXX'; // استبدله بمعرفك
  const clarityId = 'xxxxxxxxxx'; // استبدله بمعرفك

  return (
    <Helmet>
      {/* Google Analytics 4 */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </script>

      {/* Microsoft Clarity */}
      <script type="text/javascript">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `}
      </script>
    </Helmet>
  );
}