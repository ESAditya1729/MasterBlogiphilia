import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Target,
  HeartHandshake,
  PenTool,
  Globe,
  Zap,
  Sparkles,
} from "lucide-react";
import OurMission from "../assets/OurMission-img.png"; 
const SectionHeader = ({ text }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, type: "spring" }}
    className="text-3xl md:text-5xl font-bold mb-8 relative w-fit mx-auto text-center"
  >
    {text}
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-emerald-400 to-violet-500 origin-left"
    ></motion.span>
  </motion.h2>
);

const AboutUs = () => {
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
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-28 md:py-36 text-center">
  {/* Background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gradient blobs */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl animate-float"></div>
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl animate-float-delay"></div>
    
    {/* Floating leaves (add these) */}
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute top-1/4 left-[15%] w-10 opacity-80 text-emerald-400"
      animate={{ 
        y: [0, -25, 0],
        rotate: [0, 15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: 0.3
      }}
    >
      <path 
        d="M50 5L90 90L10 90Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </motion.svg>

    {/* Triangle 2 - Secondary */}
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute top-2/3 right-[20%] w-8 opacity-60 text-violet-400"
      animate={{ 
        y: [10, -20, 10],
        rotate: [-10, 10, -10],
        scale: [1, 0.9, 1]
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: 0.7
      }}
    >
      <path 
        d="M50 20L80 80L20 80Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />
    </motion.svg>
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
      We Love Stories
    </motion.h1>

    {/* Tagore Quote - Enhanced */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-8 max-w-2xl mx-auto relative"
    >
      <div className="absolute -left-6 top-0 text-5xl text-emerald-400/30 dark:text-emerald-500/30">“</div>
      <p className="text-lg italic text-slate-600 dark:text-slate-300 px-8">
        The world speaks to me in colors, my soul answers in music.
      </p>
      <div className="absolute -right-6 bottom-0 text-5xl text-emerald-400/30 dark:text-emerald-500/30">”</div>
      <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
        <span className="w-8 h-px bg-emerald-400/50"></span>
        Rabindranath Tagore
        <span className="w-8 h-px bg-emerald-400/50"></span>
      </p>
    </motion.div>

    <motion.p
      className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      Empowering the voices of tomorrow through words today. Blogiphilia is where passion meets expression.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-12"
    >
      <Sparkles className="w-16 h-16 mx-auto text-amber-400 animate-pulse" />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Start Writing Now
      </motion.button>
    </motion.div>
  </motion.div>

  {/* Add this to your global CSS */}
  <style jsx global>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    .animate-float {
      animation: float 8s ease-in-out infinite;
    }
    .animate-float-delay {
      animation: float 8s ease-in-out infinite 2s;
    }
  `}</style>
</section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-400/10 rounded-full blur-xl"></div>
            <img
              src={OurMission}
              alt="Our Mission"
              className="w-full max-w-md mx-auto relative z-10 hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-400/5 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-emerald-500" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="relative"
>
  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/10 to-violet-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  
  <div className="relative bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
    <motion.p 
      className="text-lg md:text-xl leading-relaxed md:leading-loose font-medium text-slate-700 dark:text-slate-300"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.05, delayChildren: 0.3 }}
    >
      {`Blogiphilia is not just a platform,`.split(' ').map((word, i) => (
        <motion.span 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
      
      {`it's a movement rooted in the belief that words shape worlds.`.split(' ').map((word, i) => (
        <motion.span 
          key={i+10}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i*0.03 + 0.5 }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
      
      <br /><br />
      
      <motion.span 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="block italic text-emerald-600 dark:text-emerald-400 font-serif text-center py-4 border-t border-slate-200 dark:border-slate-700 mt-4"
      >
        "Where the mind is without fear and the head is held high" 
        <span className="block text-sm mt-1">— Rabindranath Tagore</span>
      </motion.span>
      
      {`Inspired by this vision, we're building a vibrant ecosystem where authentic voices flourish.`.split(' ').map((word, i) => (
        <motion.span 
          key={i+20}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i*0.03 + 1.5 }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
    
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.2, delay: 2.2 }}
      className="h-1 bg-gradient-to-r from-emerald-400 to-violet-500 mt-6 origin-left"
    />
  </div>
</motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story (Timeline Style) */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl my-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader text="Our Journey" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10 mt-12 border-l-2 border-emerald-400/30 pl-8 relative"
          >
            <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-violet-500 origin-top"></div>

            {[
              {
                year: "2024",
                title: "Founded",
                desc: "The vision for Blogiphilia was born to democratize creative writing online and provide a platform for authentic voices.",
                icon: <PenTool className="text-emerald-500" />,
              },
              {
                year: "2025 Q1",
                title: "Beta Launched",
                desc: "Rolled out the beta version with cutting-edge writing tools, analytics dashboard, and community features.",
                icon: <Globe className="text-violet-500" />,
              },
              {
                year: "2025 Q2",
                title: "First 1000 Writers",
                desc: "Our writer community grew to 1000+ within weeks of launch, validating our mission to empower creators.",
                icon: <Users className="text-amber-500" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative pl-8 group"
              >
                <div className="absolute -left-10 top-1 w-8 h-8 bg-white dark:bg-slate-900 rounded-full border-4 border-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <span className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">
                    {item.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <SectionHeader text="Our Core Values" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {[
            {
              icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
              title: "Creativity",
              desc: "We celebrate unique perspectives and original storytelling that pushes boundaries.",
              color: "emerald",
            },
            {
              icon: <Target className="w-8 h-8 text-violet-500" />,
              title: "Purpose",
              desc: "Every word counts — we help writers make impact with clarity and intention.",
              color: "violet",
            },
            {
              icon: <HeartHandshake className="w-8 h-8 text-amber-500" />,
              title: "Community",
              desc: "We grow together through meaningful collaboration and mutual support.",
              color: "amber",
            },
          ].map((val, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-t-4 border-${val.color}-500 relative overflow-hidden group`}
            >
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-${val.color}-400/5 rounded-full group-hover:scale-150 transition-transform duration-500`}
              ></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-slate-700 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{val.title}</h4>
                <p className="text-slate-600 dark:text-slate-300">{val.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Our Team */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
        <SectionHeader text="Meet the Team" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12"
        >
          {[
            {
              name: "Aditya Mukherjee",
              role: "CEO & Founder",
              avatar: "/assets/adoenix.jpg",
              bio: "Passionate about democratizing content creation and building inclusive platforms.",
            },
            {
              name: "Barnali Banerjee",
              role: "Design Lead",
              avatar: "/assets/Maa.jpg",
              bio: "Creates intuitive experiences that bridge technology and human needs.",
            },
            {
              name: "Bidisha Dutta",
              role: "Backend Engineer",
              avatar: "/assets/jayant.jpg",
              bio: "Builds robust systems that scale with our growing community.",
            },
          ].map((member, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-violet-500/20"></div>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-sm text-emerald-500 mb-3">{member.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-28 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl animate-float-delay"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <SectionHeader text="Ready to Begin Your Story?" />
          <p className="text-xl mt-6 max-w-2xl mx-auto">
            Join thousands of creators building their audience and sharing their
            voice on Blogiphilia.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold hover:shadow-xl transition-all shadow-lg"
          >
            Start Writing Now
          </motion.button>
        </motion.div>
      </section>

      <Footer />

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
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

export default AboutUs;
