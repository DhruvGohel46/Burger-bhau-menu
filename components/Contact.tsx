import { Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const contactInfo = [
    { icon: <MapPin size={22} />, title: 'Visit Us', detail: '123 Food Street, Gourmet Avenue, NY 10001' },
    { icon: <Phone size={22} />, title: 'Call Us', detail: '+1 (234) 567-890' },
    { icon: <Clock size={22} />, title: 'Hours', detail: 'Mon – Sun: 10 AM – 11 PM' },
];

export default function Contact() {
    return (
        <section id="contact" className="py-16 md:py-24 bg-[#0B0B0B]">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Info */}
                    <div className="lg:w-1/2">
                        <span className="text-brand text-xs font-bold uppercase tracking-[0.15em]">
                            Get in Touch
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                            Visit Us or <span className="text-brand">Order Now</span>
                        </h2>
                        <p className="mt-5 text-[#A0A0A0] text-base">
                            We&apos;re always ready to serve. Reach out for orders, feedback,
                            or just to say hello!
                        </p>

                        <div className="mt-10 flex flex-col gap-6">
                            {contactInfo.map((c) => (
                                <div key={c.title} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-brand shrink-0">
                                        {c.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{c.title}</h4>
                                        <p className="text-[#6B6B6B] text-sm">{c.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <a
                                href="https://wa.me/"
                                className="bg-[#25D366] text-white px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-all shadow-[0_4px_20px_rgba(37,211,102,0.2)]"
                            >
                                <MessageCircle size={18} />
                                WhatsApp Order
                            </a>
                            <a
                                href="#"
                                className="bg-[#1A1A1A] border border-[#2A2A2A] text-white px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:border-brand/30 active:scale-95 transition-all"
                            >
                                <Send size={18} />
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-[#121212] border border-[#2A2A2A] p-6 md:p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                            <form className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white p-3.5 rounded-xl outline-none focus:border-brand/50 transition-colors placeholder:text-[#3A3A3A]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            placeholder="john@email.com"
                                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white p-3.5 rounded-xl outline-none focus:border-brand/50 transition-colors placeholder:text-[#3A3A3A]"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Topic</label>
                                    <select className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white p-3.5 rounded-xl outline-none focus:border-brand/50 transition-colors appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Message</label>
                                    <textarea
                                        rows={3}
                                        placeholder="How can we help?"
                                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white p-3.5 rounded-xl outline-none focus:border-brand/50 transition-colors resize-none placeholder:text-[#3A3A3A]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-brand hover:bg-brand-light text-white py-4 rounded-full font-bold active:scale-[0.97] transition-all shadow-[0_4px_20px_rgba(255,107,0,0.25)]"
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
