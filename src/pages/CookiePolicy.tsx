import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-600 text-sm mb-4">Last Updated: April 1, 2025</p>
        
        <p className="text-gray-700 mb-4">
          This Cookie Policy explains how SunsetView.com ("we", "us", or "our") uses cookies and similar technologies 
          on our website. This policy is part of our Privacy Policy and should be read alongside our Terms of Service.
        </p>
        
        <p className="text-gray-700">
          By using our website, you consent to the use of cookies as described in this Cookie Policy.
        </p>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What Are Cookies?</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. 
              They allow our website to recognize your device and remember certain information about your visit, such as your 
              preferences and actions.
            </p>
            
            <p className="text-gray-700">
              Cookies are widely used to make websites work more efficiently and to provide a better browsing experience. 
              They can also provide information to the owners of the site about how users interact with their website.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Types of Cookies We Use</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              We use different types of cookies for various purposes:
            </p>
            
            <h3 className="font-bold text-gray-800 mb-3">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, 
              access to secure areas of the website, and booking functionality. The website cannot function properly without these cookies.
            </p>
            
            <h3 className="font-bold text-gray-800 mb-3">Performance Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. 
              They help us improve the way our website works by, for example, ensuring that users can easily find what they are looking for.
            </p>
            
            <h3 className="font-bold text-gray-800 mb-3">Functionality Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies allow our website to remember choices you make (such as your preferred language or the region you are in) 
              and provide enhanced, more personal features. They may also be used to provide services you have asked for, such as 
              watching a video or commenting on a blog.
            </p>
            
            <h3 className="font-bold text-gray-800 mb-3">Targeting/Advertising Cookies</h3>
            <p className="text-gray-700">
              These cookies record your visit to our website, the pages you have visited, and the links you have followed. 
              We may use this information to make our website and the advertising displayed on it more relevant to your interests. 
              We may also share this information with third parties for this purpose.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Specific Cookies We Use</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">auth_token</td>
                    <td className="border border-gray-300 px-4 py-2">Used to maintain your authentication state</td>
                    <td className="border border-gray-300 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 px-4 py-2">2 days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">session_id</td>
                    <td className="border border-gray-300 px-4 py-2">Used to maintain your active session</td>
                    <td className="border border-gray-300 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">_sv_preferences</td>
                    <td className="border border-gray-300 px-4 py-2">Stores your website preferences</td>
                    <td className="border border-gray-300 px-4 py-2">Functionality</td>
                    <td className="border border-gray-300 px-4 py-2">1 year</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">_sv_analytics</td>
                    <td className="border border-gray-300 px-4 py-2">Used to collect anonymous usage data</td>
                    <td className="border border-gray-300 px-4 py-2">Performance</td>
                    <td className="border border-gray-300 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">_sv_recent_searches</td>
                    <td className="border border-gray-300 px-4 py-2">Stores your recent search history</td>
                    <td className="border border-gray-300 px-4 py-2">Functionality</td>
                    <td className="border border-gray-300 px-4 py-2">30 days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">_sv_marketing</td>
                    <td className="border border-gray-300 px-4 py-2">Used for advertising targeting</td>
                    <td className="border border-gray-300 px-4 py-2">Targeting/Advertising</td>
                    <td className="border border-gray-300 px-4 py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-gray-600 text-sm mt-4">
              This table is not exhaustive and may be updated as we change or add new cookies.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Cookies</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
              deliver advertisements, and so on. These cookies may include:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Analytics cookies</strong> from services like Google Analytics to help us understand how visitors use our site.</li>
              <li><strong>Social media cookies</strong> from platforms like Facebook, Twitter, and Instagram to enable social sharing functionality.</li>
              <li><strong>Advertising cookies</strong> from our advertising partners to help deliver more relevant advertisements.</li>
              <li><strong>Payment processing cookies</strong> from our payment providers to facilitate secure transactions.</li>
            </ul>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Managing Cookies</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              Most web browsers allow you to manage your cookie preferences. You can:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Delete cookies from your device</li>
              <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
              <li>Set your browser to notify you when you receive a cookie</li>
            </ul>
            
            <p className="text-gray-700">
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, 
              and some services may not function properly.
            </p>
            
            <h3 className="font-bold text-gray-800 mt-4 mb-3">Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              You can manage cookie preferences through your browser settings. Here are links to instructions for some common browsers:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Microsoft Edge</a></li>
            </ul>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookie Consent</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              When you first visit our website, we will ask for your consent to use cookies as described in this policy. 
              You can choose to accept or decline non-essential cookies.
            </p>
            
            <p className="text-gray-700">
              You can change your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Cookie Policy</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700">
              We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated 
              "Last Updated" date. We encourage you to review this Cookie Policy periodically to stay informed about 
              how we are using cookies.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            
            <div className="text-gray-700">
              <p>SunsetView.com</p>
              <p>123 Sunset Boulevard</p>
              <p>San Francisco, CA 94110</p>
              <p>Email: privacy@sunsetview.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;