import Layout from "./Layout.jsx";

import Home from "./Home";

import About from "./About";

import Attractions from "./Attractions";

import Booking from "./Booking";

import Contact from "./Contact";

import Impressum from "./Impressum";

import Privacy from "./Privacy";

import AdminDashboard from "./AdminDashboard";

import NotFound from "./NotFound";

import BookingSuccess from "./BookingSuccess";

import Verify from "./Verify";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    About: About,
    
    Attractions: Attractions,
    
    Booking: Booking,
    
    Contact: Contact,
    
    Impressum: Impressum,
    
    Privacy: Privacy,
    
    AdminDashboard: AdminDashboard,
    
    NotFound: NotFound,
    
    BookingSuccess: BookingSuccess,
    
    Verify: Verify,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Attractions" element={<Attractions />} />
                
                <Route path="/Booking" element={<Booking />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Impressum" element={<Impressum />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/NotFound" element={<NotFound />} />
                
                <Route path="/BookingSuccess" element={<BookingSuccess />} />
                
                <Route path="/Verify" element={<Verify />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}