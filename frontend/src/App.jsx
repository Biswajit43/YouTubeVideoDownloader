import React, { useRef } from "react";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer/Footer";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Faqs from "./Pages/Faqs";

function App() {
    // Create refs for smooth scrolling
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const faqsRef = useRef(null);

    // Handle scroll based on section name
    const scrollToSection = (section) => {
        if (section === "Home") homeRef.current?.scrollIntoView({ behavior: "smooth" });
        if (section === "About") aboutRef.current?.scrollIntoView({ behavior: "smooth" });
        if (section === "Contact") contactRef.current?.scrollIntoView({ behavior: "smooth" });
        if (section === "Faqs") faqsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* Navbar with scroll handler */}
            <Navbar scrollToSection={scrollToSection} />

            {/* Sections */}
            <div ref={homeRef}>
                <Home />
            </div>

            <div ref={aboutRef}>
                <About />
            </div>

            <div ref={contactRef}>
                <Contact />
            </div>

            <div ref={faqsRef}>
                <Faqs />
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}

export default App;
