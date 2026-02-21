'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Menu from '@/components/Menu';
import Offers from '@/components/Offers';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileOrderButton from '@/components/MobileOrderButton';

export default function HomeClient() {
    const [activeCategory, setActiveCategory] = useState('burger');

    return (
        <div className="selection:bg-[--primary] selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                <div className="container mx-auto">
                    <Menu activeCategory={activeCategory} />
                    <Offers />
                    <About />
                    <Contact />
                </div>
            </main>
            <Footer />
            <MobileOrderButton />
        </div>
    );
}
