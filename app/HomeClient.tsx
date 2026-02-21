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
        <>
            <Navbar />
            <main>
                <Hero />
                <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                <Menu activeCategory={activeCategory} />
                <Offers />
                <About />
                <Contact />
            </main>
            <Footer />
            <MobileOrderButton />
        </>
    );
}
