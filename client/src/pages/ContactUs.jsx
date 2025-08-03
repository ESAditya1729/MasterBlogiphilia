import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  Mail,
  MessageSquare,
  Users,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Github,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    
    // Optional: Show how many messages they've sent
    const messageCount = data.data.messages.length;
    if (messageCount > 1) {
      alert(`Thank you for your ${messageCount} messages! We appreciate your engagement.`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-28 md:py-36 text-center">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl animate-float-delay"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-violet-600 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let's Connect
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We're here to help and answer any questions you might have. Reach out to us and we'll respond as soon as possible.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 pb-28">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information - Centered */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 flex flex-col items-center"
          >
            {/* Email Card - Centered */}
            <motion.div 
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group w-full max-w-md"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-500 mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">blogiphiliabuddy@outlook.com</p>
                <motion.a
                  href="mailto:blogiphiliabuddy@outlook.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </motion.a>
              </div>
            </motion.div>

            {/* Social Media Card - Centered */}
            <motion.div 
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group w-full max-w-md"
            >
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-400/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-4 rounded-xl bg-violet-50 dark:bg-slate-700 text-violet-500 mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Connect with us and stay updated through our social channels.
                </p>
                <div className="flex gap-4 justify-center">
                  {[
                    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", color: "sky" },
                    { icon: <Github className="w-5 h-5" />, name: "GitHub", color: "slate" },
                    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", color: "blue" },
                    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "pink" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ y: -5 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center bg-${social.color}-50 dark:bg-slate-700 text-${social.color}-500 hover:bg-${social.color}-100 dark:hover:bg-slate-600 transition-colors`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form (Right Side - Unchanged) */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-violet-400/10 rounded-full opacity-60"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-emerald-400/10 rounded-full opacity-60"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Send us a message</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Fill out the form below and we'll get back to you soon.
              </p>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Message sent successfully!</h4>
                    <p className="text-sm mt-1">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Something went wrong</h4>
                    <p className="text-sm mt-1">Please try again later or contact us through another method.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
        <div className="mt-10 border-t border-slate-300 dark:border-slate-700 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Blogiphilia. All rights reserved.
      </div>
      </section>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;