import React, { useState, FormEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import { Send, CheckCircle, Linkedin } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';

const fadeIn = (direction = 'up', delay = 0): Variants => ({
    hidden: { 
        y: direction === 'up' ? 20 : -20,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delay,
            duration: 0.6,
            ease: 'easeOut',
        },
    },
});

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M18.901 1.153H22.299L14.898 9.488L23.498 22.847H16.698L10.998 15.832L4.50061 22.847H1.10261L8.99961 13.97L1.50061 1.153H8.50061L13.5996 7.632L18.901 1.153ZM17.6 20.671H19.6L6.4 3.12H4.4L17.6 20.671Z" fill="currentColor"/>
    </svg>
);


const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const form = e.target as HTMLFormElement;
        const netlifyFormData = new URLSearchParams(new FormData(form) as any);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: netlifyFormData.toString()
        })
        .then(() => {
            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        })
        .catch(() => {
            setError('Something went wrong. Please try again.');
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeIn('down')}>
                <h2 className="text-4xl font-sans font-bold text-center mb-4">
                    <AnimatedText text="LET'S BUILD SOMETHING AMAZING" el="span" />
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="bg-surface p-8 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-xl"
            >
                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                        <h3 className="text-2xl font-bold mt-4 text-primary">Thank You!</h3>
                        <p className="text-text-dim mt-2">Your message has been sent successfully. I typically respond within 24 hours.</p>
                    </motion.div>
                ) : (
                    <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} data-netlify-honeypot="bot-field">
                        <input type="hidden" name="form-name" value="contact" />
                        <p className="hidden">
                            <label>
                                Don’t fill this out if you’re human: <input name="bot-field" />
                            </label>
                        </p>
                        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                            <motion.div variants={fadeIn('up')}>
                                <label htmlFor="name" className="block text-text-main font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-base/80 p-3 rounded-md border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </motion.div>
                            <motion.div variants={fadeIn('up')}>
                                <label htmlFor="email" className="block text-text-main font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-base/80 p-3 rounded-md border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="Your Email"
                                />
                            </motion.div>
                            <motion.div variants={fadeIn('up')}>
                                <label htmlFor="message" className="block text-text-main font-semibold mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full bg-base/80 p-3 rounded-md border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="Your Message"
                                ></textarea>
                            </motion.div>
                            <motion.div variants={fadeIn('up')} className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-base bg-gradient-to-r from-primary to-yellow-600 rounded-md transition-all duration-300 ease-out hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed hover:shadow-glow-gold animate-pulse-glow"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
                                </button>
                            </motion.div>
                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </motion.div>
                    </form>
                )}
            </motion.div>

            <motion.div 
                className="mt-16 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeIn('up', 0.2)}
            >
                <p className="text-text-dim mb-4">Or find me on these platforms:</p>
                <div className="flex justify-center items-center space-x-8">
                    <a href="https://x.com/MeLx54" target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-primary transition-colors duration-300" aria-label="X.com Profile">
                        <XLogo />
                    </a>
                    <a href="https://www.linkedin.com/in/safal-karki-66a73b38b/" target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-primary transition-colors duration-300" aria-label="LinkedIn Profile">
                        <Linkedin size={28} />
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;