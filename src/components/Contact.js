import React from 'react';
import { Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-white" style={{ paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#ffffff' }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16" style={{ display: 'flex', gap: '4rem' }}>
                    <div className="lg:w-1/2" style={{ width: '100%' }}>
                        <span className="text-[#FF6B00] font-bold tracking-widest uppercase text-sm" style={{ color: '#FF6B00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem' }}>Get in Touch</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900" style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>Visit Us or <span className="text-[#FF6B00]" style={{ color: '#FF6B00' }}>Order Now</span></h2>
                        <p className="mt-6 text-gray-500 text-lg" style={{ marginTop: '1.5rem', color: '#6b7280', fontSize: '1.125rem' }}>We're always ready to serve you the best food. Reach out to us for orders, feedback, or just to say hello!</p>

                        <div className="mt-12 space-y-8" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="flex items-center gap-6 group" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div className="w-14 h-14 bg-gray-50 text-[#FF6B00] rounded-2xl flex items-center justify-center p-3 shadow-sm"
                                    style={{ width: '56px', height: '56px', backgroundColor: '#f9fafb', color: '#FF6B00', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg" style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>Our Location</h4>
                                    <p className="text-gray-500" style={{ color: '#6b7280' }}>123 Food Street, Gourmet Avenue, NY 10001</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div className="w-14 h-14 bg-gray-50 text-[#FF6B00] rounded-2xl flex items-center justify-center p-3 shadow-sm"
                                    style={{ width: '56px', height: '56px', backgroundColor: '#f9fafb', color: '#FF6B00', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg" style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>Phone Number</h4>
                                    <p className="text-gray-500" style={{ color: '#6b7280' }}>+1 (234) 567-890</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div className="w-14 h-14 bg-gray-50 text-[#FF6B00] rounded-2xl flex items-center justify-center p-3 shadow-sm"
                                    style={{ width: '56px', height: '56px', backgroundColor: '#f9fafb', color: '#FF6B00', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg" style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>Opening Hours</h4>
                                    <p className="text-gray-500" style={{ color: '#6b7280' }}>Mon - Sun: 10:00 AM - 11:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4" style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-lg min-h-[56px] min-w-[200px]"
                                style={{ backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '9999px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', minHeight: '56px', minWidth: '200px' }}>
                                <MessageCircle size={24} />
                                Order via WhatsApp
                            </button>
                            <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#FF6B00] transition-all shadow-lg min-h-[56px] min-w-[200px]"
                                style={{ backgroundColor: '#1A1A1A', color: 'white', padding: '16px 32px', borderRadius: '9999px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', minHeight: '56px', minWidth: '200px' }}>
                                <Send size={24} />
                                Our Location
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-1/2" style={{ width: '100%' }}>
                        <div className="bg-gray-50 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100"
                            style={{ backgroundColor: '#f9fafb', padding: '3rem', borderRadius: '40px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                            <h3 className="text-3xl font-bold mb-8 text-gray-900" style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Send us a Message</h3>
                            <form className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="text-sm font-bold text-gray-700 ml-1" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Your Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none transition-all"
                                            style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '1rem' }} />
                                    </div>
                                    <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="text-sm font-bold text-gray-700 ml-1" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none transition-all"
                                            style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '1rem' }} />
                                    </div>
                                </div>
                                <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label className="text-sm font-bold text-gray-700 ml-1" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Message Topic</label>
                                    <select className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none transition-all appearance-none cursor-pointer"
                                        style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '1rem' }}>
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Feedback</option>
                                        <option>Franchise Opportunity</option>
                                    </select>
                                </div>
                                <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label className="text-sm font-bold text-gray-700 ml-1" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Your Message</label>
                                    <textarea rows={4} placeholder="How can we help you?" className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none transition-all"
                                        style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '1rem', resize: 'none' }}></textarea>
                                </div>
                                <button className="w-full bg-[#FF6B00] text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-[#FF6B00]/20 transition-all transform hover:-translate-y-1"
                                    style={{ width: '100%', backgroundColor: '#FF6B00', color: 'white', padding: '1.25rem', borderRadius: '1rem', fontWeight: 700, fontSize: '1.125rem' }}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
