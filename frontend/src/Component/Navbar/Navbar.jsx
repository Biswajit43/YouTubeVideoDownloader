import React, { useState } from 'react';

const Navbar = ({ scrollToSection }) => {
    const [activeItem, setActiveItem] = useState("Home");
    const navItems = ['Home', 'About', 'Contact us', 'Faqs'];

    return (
        <div className='flex justify-between p-5 bg-[#021b2f] text-white shadow-md'>
            <div className='flex gap-2'>
                <h1>URLtoVID</h1>
            </div>
            <ul className='flex gap-5'>
                {navItems.map((item, ind) => (
                    <li
                        key={ind}
                        onClick={() => {
                            setActiveItem(item);
                            scrollToSection(item);  // ✅ Scrolls to section
                        }}
                        className={`cursor-pointer pb-1 transition duration-400 ${item === activeItem
                            ? "border-b-2 border-[#7fdbff] text-[#7fdbff]"
                            : "text-gray-300 hover:text-white"
                            }`}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;
