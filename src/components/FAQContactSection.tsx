import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, Phone, Mail, Clock, HelpCircle, Send } from 'lucide-react';
import { STORE_INFO, FAQS } from '../data/menuData';

export const FAQContactSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    alert('Thank you! Your message has been sent to Pizza Pro Shergarh management.');
    setContactName('');
    setContactMessage('');
  };

  return (
    <section id="contact" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* FAQ Section */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </span>
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
              Got Questions? We Have Answers
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-zinc-900 hover:text-red-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 pt-0 text-xs text-zinc-600 leading-relaxed font-medium border-t border-zinc-200/60"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location & Google Maps & Contact Card */}
        <div className="pt-8 border-t border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/50">
                VISIT OR CALL US
              </span>

              <h3 className="text-2xl sm:text-3xl font-black italic text-white">
                Pizza Pro Shergarh
              </h3>

              <div className="space-y-3 text-xs text-zinc-300 font-medium pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h5 className="font-extrabold text-white uppercase">Address</h5>
                    <p>{STORE_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <div>
                    <h5 className="font-extrabold text-white uppercase">Order Numbers</h5>
                    <div className="flex flex-col gap-1 mt-0.5">
                      {STORE_INFO.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="font-mono font-bold text-red-400 hover:underline"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h5 className="font-extrabold text-white uppercase">Branch Hours</h5>
                    <p>{STORE_INFO.timings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-2 pt-4 border-t border-zinc-800 text-xs">
              <h5 className="font-bold text-zinc-300">Send Direct Feedback</h5>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
              />
              <textarea
                rows={2}
                placeholder="Message..."
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          </div>

          {/* Google Maps Location Embed Container */}
          <div className="lg:col-span-7 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 relative min-h-[350px] flex items-center justify-center shadow-inner">
            <iframe
              title="Pizza Pro Shergarh Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13650.000000000000!2d73.80000000000000!3d30.85000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3918000000000000%3A0x0!2zMzDCsDUxJzAwLjAiTiA3M8KwNDgnMDAuMCJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk"
              className="w-full h-full min-h-[350px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
