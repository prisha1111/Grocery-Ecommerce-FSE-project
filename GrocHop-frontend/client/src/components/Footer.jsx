import React from 'react';
import appStoreIcon from '../assets/appstore.png';
import googlePlayIcon from '../assets/googleplay.png';
import facebookIcon from '../assets/facebook.png';
import twitterIcon from '../assets/twitter.png';
import instagramIcon from '../assets/instagram.png';
import linkedinIcon from '../assets/linkedin.png';

function Footer() {
  return (
    <footer className="bg-gray-100 p-6 mt-auto">
      <div className="container mx-auto text-center text-gray-600">
        <div className="grid grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-semibold text-gray-800">Useful Links</h4>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900">About</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Press</a></li>
              <li><a href="#" className="hover:text-gray-900">Lead</a></li>
              <li><a href="#" className="hover:text-gray-900">Value</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Privacy</h4>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900">Terms</a></li>
              <li><a href="#" className="hover:text-gray-900">FAQs</a></li>
              <li><a href="#" className="hover:text-gray-900">Security</a></li>
              <li><a href="#" className="hover:text-gray-900">Mobile</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Partner</h4>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900">Franchise</a></li>
              <li><a href="#" className="hover:text-gray-900">Seller</a></li>
              <li><a href="#" className="hover:text-gray-900">Warehouse</a></li>
              <li><a href="#" className="hover:text-gray-900">Deliver</a></li>
              <li><a href="#" className="hover:text-gray-900">Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Categories see all</h4>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900">Vegetables & Fruits</a></li>
              <li><a href="#" className="hover:text-gray-900">Cold Drinks & Juices</a></li>
              <li><a href="#" className="hover:text-gray-900">Bakery & Biscuits</a></li>
              <li><a href="#" className="hover:text-gray-900">Dairy & Breakfast</a></li>
              <li><a href="#" className="hover:text-gray-900">Munchies</a></li>
              <li><a href="#" className="hover:text-gray-900">Tea, Coffee & Health Drinks</a></li>
              <li><a href="#" className="hover:text-gray-900">Atta, Rice & Dal</a></li>
              <li><a href="#" className="hover:text-gray-900">Beauty & Personal Care</a></li>
              <li><a href="#" className="hover:text-gray-900">Electronics</a></li>
              <li><a href="#" className="hover:text-gray-900">Toys & Games</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500">© GrocHop Commerce Private Limited, 2016-2025</p>
        <div className="flex justify-center space-x-4 mt-4">
          <span className="text-xs">Download App</span>
          <a href="https://www.apple.com/app-store/" className="inline-block">
            <img 
              src={appStoreIcon} 
              alt="App Store" 
              className="w-13 h-12 object-contain" 
              onError={(e) => console.log("App Store icon failed to load", e)} 
            />
          </a>
          <a href="https://play.google.com/store" className="inline-block">
            <img 
              src={googlePlayIcon} 
              alt="Google Play" 
              className="w-13 h-12 object-contain" 
              onError={(e) => console.log("Google Play icon failed to load", e)} 
            />
          </a>
          <a href="#" className="inline-block">
            <img 
              src={facebookIcon} 
              alt="Facebook" 
              className="w-10 h-10 rounded-full bg-gray-200 p-0.5 object-contain" 
              onError={(e) => console.log("Facebook icon failed to load", e)} 
            />
          </a>
          <a href="#" className="inline-block">
            <img 
              src={twitterIcon} 
              alt="Twitter" 
              className="w-10 h-10 rounded-full bg-gray-200 p-0.5 object-contain" 
              onError={(e) => console.log("Twitter icon failed to load", e)} 
            />
          </a>
          <a href="#" className="inline-block">
            <img 
              src={instagramIcon} 
              alt="Instagram" 
              className="w-10 h-10 rounded-full bg-gray-200 p-0.5 object-contain" 
              onError={(e) => console.log("Instagram icon failed to load", e)} 
            />
          </a>
          <a href="#" className="inline-block">
            <img 
              src={linkedinIcon} 
              alt="LinkedIn" 
              className="w-10 h-10 rounded-full bg-gray-200 p-0.5 object-contain" 
              onError={(e) => console.log("LinkedIn icon failed to load", e)} 
            />
          </a>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          "GrocHop" is owned & managed by "GrocHop Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to "GROCHOP.COM" which is a real estate services business operated by "GrocHop Services Private Limited".
        </p>
      </div>
    </footer>
  );
}

export default Footer;