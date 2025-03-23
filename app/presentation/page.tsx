'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const PresentationPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });
  const flowchartRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides for presentation
  const slides = [
    {
      id: 'intro',
      title: 'Digital Health Records',
      subtitle: 'Revolutionizing healthcare data management in India with AI-powered digitization'
    },
    {
      id: 'problem-solution',
      title: 'The Challenge → The Solution',
      component: 'ProblemSolution'
    },
    {
      id: 'workflow',
      title: 'Our Workflow',
      component: 'Workflow'
    },
    {
      id: 'market-reach',
      title: 'Market Opportunity',
      component: 'MarketReach'
    },
    {
      id: 'business-model',
      title: 'Business Model',
      component: 'BusinessModel'
    },
    {
      id: 'benefits',
      title: 'Key Benefits',
      component: 'Benefits'
    },
    {
      id: 'cta',
      title: 'Ready to Transform Healthcare Data?',
      component: 'CallToAction'
    }
  ];

  // Steps in our workflow with descriptions
  const workflowSteps = [
    {
      title: "Document Upload",
      description: "Healthcare documents (handwritten or digital) are uploaded to our secure platform",
      icon: "📄",
      color: "#4F46E5"
    },
    {
      title: "AI-Powered OCR",
      description: "Advanced Document AI extracts text and data from medical documents with high precision",
      icon: "🔍",
      color: "#06B6D4"
    },
    {
      title: "Patient Verification",
      description: "Automated calls verify the extracted information directly with patients",
      icon: "📞",
      color: "#10B981"
    },
    {
      title: "Data Refinement",
      description: "AI processes verified information and structures the medical data",
      icon: "⚙️",
      color: "#F59E0B"
    },
    {
      title: "Secure Storage",
      description: "Verified and structured health records are securely stored in the digital system",
      icon: "🔐",
      color: "#8B5CF6"
    }
  ];

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    // Auto-advance through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const goToNextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.2,
        ease: "easeOut" 
      }
    }
  };

  const flowChartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.4,
        ease: "easeOut" 
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.2,
        ease: "easeInOut",
        yoyo: Infinity
      }
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Components for each slide
  const ProblemSolution = () => (
    <motion.section variants={titleVariants} className="my-12 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        The Challenge <span className="text-red-400">→</span> The Solution
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(66, 153, 225, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-red-400">The Problem</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-red-400">●</span>
              <span>Most medical records in India remain handwritten, creating barriers to digital healthcare</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">●</span>
              <span>Manual digitization is time-consuming, expensive, and error-prone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">●</span>
              <span>Handwriting variations make automated digitization challenging</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">●</span>
              <span>Errors in medical data can lead to serious healthcare issues</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(72, 187, 120, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-green-400">Our Solution</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">●</span>
              <span>AI-powered document analysis with state-of-the-art OCR technology</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">●</span>
              <span>Automated patient verification calls to confirm data accuracy</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">●</span>
              <span>Structured data extraction for seamless integration with healthcare systems</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">●</span>
              <span>Secure, accessible digital health records for improved patient care</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );

  const Workflow = () => (
    <motion.section 
      variants={flowChartVariants} 
      className="my-16 w-full max-w-5xl"
      ref={flowchartRef}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-300">
        Our Workflow
      </h2>

      {/* Interactive workflow visualization */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-28 left-0 w-full h-1 bg-gray-700 z-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-in-out"
            style={{ width: `${(activeStep / (workflowSteps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-1/5">
              <motion.div 
                className={`relative flex items-center justify-center w-16 h-16 rounded-full mb-3 text-2xl 
                  ${activeStep === index ? 'ring-4 ring-white ring-opacity-50' : ''}`}
                style={{ 
                  backgroundColor: step.color,
                  boxShadow: activeStep === index ? `0 0 25px ${step.color}` : 'none',
                }}
                animate={{
                  scale: activeStep === index ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: activeStep === index ? Infinity : 0,
                  repeatType: "reverse"
                }}
                onClick={() => setActiveStep(index)}
              >
                {step.icon}
              </motion.div>
              <h3 className={`text-sm font-semibold text-center transition-colors duration-300
                ${activeStep === index ? 'text-white' : 'text-gray-400'}`}>
                {step.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Description box */}
        <motion.div 
          className="mt-12 bg-gray-800/80 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-lg"
          animate={{
            backgroundColor: [
              'rgba(31, 41, 55, 0.8)',
              `${workflowSteps[activeStep].color}22`,
              'rgba(31, 41, 55, 0.8)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl"
              style={{ backgroundColor: workflowSteps[activeStep].color }}
            >
              {workflowSteps[activeStep].icon}
            </div>
            <h3 className="text-xl font-bold">{workflowSteps[activeStep].title}</h3>
          </div>
          <p className="text-gray-300">{workflowSteps[activeStep].description}</p>
        </motion.div>
      </div>
    </motion.section>
  );

  const MarketReach = () => (
    <motion.section variants={descriptionVariants} className="my-12 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        Market Opportunity
      </h2>
      
      <div className="grid grid-cols-1 gap-8">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-8 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(66, 153, 225, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">India's Healthcare Market</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400 text-xl">•</span>
                  <div>
                    <span className="font-semibold text-white">1.3+ Billion</span>
                    <p className="text-gray-300 mt-1">Population requiring healthcare services, creating massive document processing needs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400 text-xl">•</span>
                  <div>
                    <span className="font-semibold text-white">90%</span>
                    <p className="text-gray-300 mt-1">Of medical records in India still maintained on paper, creating digitization opportunity</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400 text-xl">•</span>
                  <div>
                    <span className="font-semibold text-white">$372 Billion</span>
                    <p className="text-gray-300 mt-1">Healthcare market size by 2022, growing at a CAGR of 22%</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="h-64 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg p-6 flex flex-col justify-center items-center">
                <div className="text-5xl font-bold text-blue-400 mb-4">$50B+</div>
                <p className="text-center text-gray-300">Estimated market opportunity for healthcare digitization services in India by 2025</p>
                
                <div className="w-full mt-8 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{width: '78%'}}></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">78% Annual Growth Rate</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
            <h4 className="text-lg font-semibold text-indigo-300 mb-2">Target Segments</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3">
                <div className="text-3xl text-indigo-400 mb-2">🏥</div>
                <div className="font-medium text-white">Hospitals</div>
                <div className="text-sm text-gray-400">20,000+ facilities</div>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl text-indigo-400 mb-2">👨‍⚕️</div>
                <div className="font-medium text-white">Clinics</div>
                <div className="text-sm text-gray-400">100,000+ practices</div>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl text-indigo-400 mb-2">💊</div>
                <div className="font-medium text-white">Pharmacies</div>
                <div className="text-sm text-gray-400">850,000+ nationwide</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );

  const BusinessModel = () => (
    <motion.section variants={descriptionVariants} className="my-12 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        Business Model
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(66, 153, 225, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Subscription-Based Revenue
          </h3>
          
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg">
            <h4 className="font-medium text-white mb-2">Premium Subscription Tiers</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><span className="font-medium text-white">Basic:</span> ₹4,999/month - Up to 500 documents</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><span className="font-medium text-white">Professional:</span> ₹9,999/month - Up to 2,000 documents</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><span className="font-medium text-white">Enterprise:</span> Custom pricing - Unlimited documents</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-lg">
            <h4 className="font-medium text-white mb-2">Per-Document Pricing</h4>
            <p className="text-gray-300 mb-2">Pay-as-you-go option at ₹15 per document for organizations with variable needs</p>
            <div className="flex items-center mt-4">
              <div className="text-lg font-bold text-purple-400 mr-2">80%</div>
              <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-purple-500" style={{width: '80%'}}></div>
              </div>
              <div className="text-sm text-gray-400 ml-2">Margin</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(72, 187, 120, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Growth Strategy
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center text-sm">1</span>
                Initial Focus
              </h4>
              <p className="text-gray-300">Target metro cities with high-density hospital networks and clinics</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center text-sm">2</span>
                Expansion Phase
              </h4>
              <p className="text-gray-300">Roll out to Tier-2 cities with localized support teams</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center text-sm">3</span>
                Partnership Network
              </h4>
              <p className="text-gray-300">Integrate with existing hospital management systems</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-teal-900/20 to-teal-800/20 rounded-lg">
            <h4 className="font-medium text-white mb-3">Revenue Projection</h4>
            <div className="relative h-32">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-1/4 h-[30%] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg mx-1 flex justify-center pt-1">
                  <span className="text-xs font-medium">Y1</span>
                </div>
                <div className="w-1/4 h-[50%] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg mx-1 flex justify-center pt-1">
                  <span className="text-xs font-medium">Y2</span>
                </div>
                <div className="w-1/4 h-[75%] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg mx-1 flex justify-center pt-1">
                  <span className="text-xs font-medium">Y3</span>
                </div>
                <div className="w-1/4 h-[95%] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg mx-1 flex justify-center pt-1">
                  <span className="text-xs font-medium">Y4</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full flex justify-between px-3">
                <div className="text-xs text-teal-400">₹5Cr</div>
                <div className="text-xs text-teal-400">₹25Cr</div>
                <div className="text-xs text-teal-400">₹60Cr</div>
                <div className="text-xs text-teal-400">₹100Cr+</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );

  const Benefits = () => (
    <motion.section variants={descriptionVariants} className="my-16 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        Key Benefits
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(66, 153, 225, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-4xl mb-4 text-blue-400">🏥</div>
          <h3 className="text-xl font-semibold mb-2">Improved Healthcare</h3>
          <p className="text-gray-300">Digital records enable better diagnosis, reduce medical errors, and improve patient outcomes.</p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-4xl mb-4 text-yellow-400">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Enhanced Efficiency</h3>
          <p className="text-gray-300">Automated digitization reduces the time and resources needed to process medical records.</p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-4xl mb-4 text-purple-400">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Data Accuracy</h3>
          <p className="text-gray-300">Patient verification ensures the highest level of accuracy in digitized medical records.</p>
        </motion.div>
      </div>
    </motion.section>
  );

  const CallToAction = () => (
    <motion.div 
      variants={descriptionVariants}
      className="my-16 text-center w-full max-w-5xl"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Ready to Transform Healthcare Data?
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        Join us in revolutionizing healthcare record management in India with our AI-powered digitization solution.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          initial="initial"
        >
          <Link href="/">
            <span className="block py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              Try Demo
            </span>
          </Link>
        </motion.div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          initial="initial"
        >
          <Link href="/records">
            <span className="block py-3 px-8 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              View Records
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-500 rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 20}px`,
                height: `${Math.random() * 300 + 20}px`,
                filter: 'blur(50px)',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(50, 50, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Navigation controls */}
      <div className="fixed top-1/2 left-4 z-20 -translate-y-1/2">
        <motion.button
          className={`p-3 rounded-full bg-gray-800/50 backdrop-blur border border-gray-700 text-white mb-4 
            ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/70'}`}
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          whileHover={currentSlide !== 0 ? { scale: 1.1 } : {}}
          whileTap={currentSlide !== 0 ? { scale: 0.95 } : {}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>

      <div className="fixed top-1/2 right-4 z-20 -translate-y-1/2">
        <motion.button
          className={`p-3 rounded-full bg-gray-800/50 backdrop-blur border border-gray-700 text-white mb-4 
            ${currentSlide === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/70'}`}
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          whileHover={currentSlide !== slides.length - 1 ? { scale: 1.1 } : {}}
          whileTap={currentSlide !== slides.length - 1 ? { scale: 0.95 } : {}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Slide indicators */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-blue-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Full screen button */}
      <div className="fixed top-4 right-4 z-20">
        <motion.button
          className="p-3 rounded-full bg-gray-800/50 backdrop-blur border border-gray-700 text-white"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </motion.button>
      </div>

      {/* Presentation slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10 min-h-screen flex flex-col"
        >
          {currentSlide === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center px-4">
              <motion.h1 
                className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Digital Health Records
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-blue-200 max-w-3xl text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Revolutionizing healthcare data management in India with AI-powered digitization
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button 
                  onClick={goToNextSlide}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg text-white font-medium shadow-lg"
                >
                  <span>Start Presentation</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            </div>
          )}

          {currentSlide === 1 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <ProblemSolution />
            </div>
          )}

          {currentSlide === 2 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <Workflow />
            </div>
          )}

          {currentSlide === 3 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <MarketReach />
            </div>
          )}

          {currentSlide === 4 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <BusinessModel />
            </div>
          )}

          {currentSlide === 5 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <Benefits />
            </div>
          )}

          {currentSlide === 6 && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
              <CallToAction />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Presentation slide number */}
      <div className="fixed bottom-6 right-6 z-20 py-1 px-3 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-full text-sm text-gray-300">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Robotic elements */}
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="50" fill="none" stroke="#4F46E5" strokeWidth="2" strokeDasharray="10 5" className="animate-spin-slow" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="20 10" className="animate-reverse-spin" />
        </svg>
      </div>

      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PresentationPage; 