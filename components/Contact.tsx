import { Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column — Info */}
                    <div className="lg:w-1/2">
                        <span
                            className="font-bold tracking-widest uppercase text-sm"
                            style={{ color: 'var(--primary)' }}
                        >
                            Get in Touch
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
                            Visit Us or{' '}
                            <span style={{ color: 'var(--primary)' }}>Order Now</span>
                        </h2>
                        <p className="mt-6 text-gray-500 text-lg">
                            We&apos;re always ready to serve you the best food. Reach out to
                            us for orders, feedback, or just to say hello!
                        </p>

                        <div className="mt-12 flex flex-col gap-8">
                            {[
                                {
                                    icon: <MapPin size={28} />,
                                    title: 'Our Location',
                                    detail: '123 Food Street, Gourmet Avenue, NY 10001',
                                },
                                {
                                    icon: <Phone size={28} />,
                                    title: 'Phone Number',
                                    detail: '+1 (234) 567-890',
                                },
                                {
                                    icon: <Clock size={28} />,
                                    title: 'Opening Hours',
                                    detail: 'Mon - Sun: 10:00 AM - 11:00 PM',
                                },
                            ].map((item) => (
                                <div key={item.title} className="flex items-center gap-6">
                                    <div
                                        className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-3 shadow-sm"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-500">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <button
                                className="text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-lg min-h-[56px]"
                                style={{ backgroundColor: '#25D366' }}
                            >
                                <MessageCircle size={24} />
                                Order via WhatsApp
                            </button>
                            <button
                                className="text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#FF6B00] transition-all shadow-lg min-h-[56px]"
                                style={{ backgroundColor: 'var(--secondary)' }}
                            >
                                <Send size={24} />
                                Our Location
                            </button>
                        </div>
                    </div>

                    {/* Right Column — Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-gray-50 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-3xl font-bold mb-8 text-gray-900">
                                Send us a Message
                            </h3>
                            <form className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Message Topic
                                    </label>
                                    <select className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Feedback</option>
                                        <option>Franchise Opportunity</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Your Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="How can we help you?"
                                        className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none"
                                        style={{ resize: 'none' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
                                    style={{ backgroundColor: 'var(--primary)' }}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
