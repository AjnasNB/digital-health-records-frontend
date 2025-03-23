'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

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
      title: 'Docufy',
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
      id: 'tech-stack',
      title: 'Our Technology Stack',
      component: 'TechStack'
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
              <span>Secure, accessible Docufy records for improved patient care</span>
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

  const TechStack = () => (
    <motion.section variants={titleVariants} className="my-12 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        Our Technology Stack
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
            <span className="text-3xl mr-2">🖥️</span> Frontend Stack
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" height="20" width="20" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"></path></svg>
              </div>
              <div>
                <strong>Next.js:</strong> React framework for server-side rendering and static site generation with TypeScript support
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 54 54" fill="none" className="text-white">
                  <path d="M27 53.5C41.6355 53.5 53.5 41.6355 53.5 27C53.5 12.3645 41.6355 0.5 27 0.5C12.3645 0.5 0.5 12.3645 0.5 27C0.5 41.6355 12.3645 53.5 27 53.5Z" stroke="white"/>
                  <path d="M18 36L36 18M36 18H21M36 18V33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong>TailwindCSS:</strong> Utility-first CSS framework for rapid UI development with responsive design
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" height="20" width="20" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M16.05 3.007c-2.88-.144-5.76-.288-8.64-.432-1.392 0-2.784 0-4.176.144C1.566 2.719.414 3.151.054 5.359c-.36 3.312-.36 6.624-.36 9.936 0 3.456.072 6.912.36 10.224.36 2.196 1.512 2.628 3.168 2.628 1.44 0 2.88.144 4.32.144 2.88-.144 5.76-.288 8.64-.432 1.512 0 3.024-.144 4.536-.144 1.656 0 2.808-.432 3.168-2.628.36-3.312.36-6.768.36-10.224 0-3.312-.072-6.624-.36-9.936-.36-2.196-1.512-2.628-3.168-2.628-1.512-.144-3.024-.144-4.536-.144v.072zm-1.8 17.856c-3.168.144-6.336.288-9.504.288-1.44 0-1.8-.36-1.8-1.8 0-2.808-.072-5.76 0-8.568 0-2.808.072-5.616 0-8.424 0-1.44.36-1.8 1.8-1.8 3.168.144 6.336.288 9.504.288 3.168 0 6.336-.144 9.504-.288 1.44 0 1.8.36 1.8 1.8.072 2.808 0 5.76 0 8.568v4.824c0 1.296 0 2.52-.072 3.744-.72 1.44-.36 1.8-1.8 1.8-3.096.144-6.264.288-9.432.288v.216z"></path><path d="M14.178 15.048c1.584-.504 2.448-1.656 2.448-3.312 0-1.008-.288-1.944-.864-2.664-.576-.72-1.584-1.224-2.88-1.44-.576-.072-1.512-.144-2.448-.144h-3.24c-.36 0-.72.288-.72.72v10.728c0 .432.288.72.72.72h3.6c1.584 0 3.24-.072 4.248-.576 1.08-.576 1.8-1.584 1.8-3.168 0-1.512-1.008-2.808-2.664-3.168v.216zm-4.104-4.608h.72c1.44 0 2.376.36 2.376 1.728 0 1.584-1.368 1.8-2.592 1.8h-.504v-3.528zm1.8 8.784h-1.8v-3.744h.72c1.584 0 3.024.216 3.024 2.088 0 1.656-1.512 1.656-1.944 1.656z"></path></svg>
              </div>
              <div>
                <strong>Framer Motion:</strong> Animation library for React with advanced motion capabilities
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3">
                <svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M2 16.67A5 5 0 0 1 5.9 12v1.1a3.9 3.9 0 0 0-3.9 3.57V16.67Z" fill="currentColor" />
                  <path d="M0 11.67v-2a7 7 0 0 1 7-7h10a7 7 0 0 1 7 7v2h-2v-2a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2H0Z" fill="currentColor" />
                  <path d="M12 11.67a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
                  <path d="M7 16.67a5 5 0 0 1 10 0v1.1a3.9 3.9 0 0 0-3.9-3.57 3.9 3.9 0 0 0-3.9 3.57H7v-1.1Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <strong>React Context API:</strong> For global state management and authentication handling
              </div>
            </li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
            <span className="text-3xl mr-2">⚙️</span> Backend Stack
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" height="20" width="20" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.218 18.616c-.354.069-.468-.149-.468-.336v-1.921c0-.653-.229-1.079-.481-1.296 1.56-.173 3.198-.765 3.198-3.454 0-.765-.273-1.389-.721-1.879.068-.177.302-.897-.068-1.872 0 0-.587-.188-1.923-.717a6.78 6.78 0 0 0-1.75-.236 6.77 6.77 0 0 0-1.752.236c-1.337-.903-1.925-.717-1.925-.717-.368.975-.132 1.695-.065 1.872a2.7 2.7 0 0 0-.722 1.879c0 2.682 1.634 3.282 3.189 3.459-.215.189-.407.523-.475 1.011-.429.193-1.52.523-2.189-.623 0 0-.398-.72-1.153-.772 0 0-.734-.009-.052.459 0 0 .496.232.838 1.097 0 0 .435 1.346 2.519.894v1.413c0 .187-.113.405-.462.339-2.866-.956-4.934-3.673-4.934-6.865 0-3.991 3.243-7.234 7.235-7.234 3.99 0 7.233 3.242 7.233 7.233.002 3.195-2.068 5.909-4.937 6.866z"></path></svg>
              </div>
              <div>
                <strong>Node.js:</strong> JavaScript runtime for building scalable server-side applications
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="text-white">
                  <path fill="currentColor" d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 0 1-2.589 3.957 6.272 6.272 0 0 1-7.306-.933 6.575 6.575 0 0 1-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 0 1 0 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z" />
                </svg>
              </div>
              <div>
                <strong>Express.js:</strong> Web application framework for building RESTful APIs with Node.js
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" height="20" width="20" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"></path></svg>
              </div>
              <div>
                <strong>MongoDB:</strong> NoSQL database for flexible, scalable document storage
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="text-white">
                  <path fill="currentColor" d="M18.75.031c-7.068 0-13.781 4.659-13.781 12.651 0 4.101 1.719 7.099 4.563 9.177l.75.593v1.344l2.313-1.219c1.88.536 3.907.755 6.156.755 7.068 0 13.75-4.657 13.75-12.65S25.818.031 18.75.031zm0 1.938c6.234 0 11.781 4.037 11.781 10.682 0 6.646-5.547 10.719-11.781 10.719-2.214 0-4.161-.22-5.937-.782l-.531-.187-.469.25-1 .531v-.937l-.375-.281c-2.516-1.802-3.938-4.332-3.938-7.875 0-6.646 5.516-10.682 11.75-10.682zM9.219 8.625c-.625 0-1.125.5-1.125 1.125 0 5.698 4.662 10.312 10.375 10.312.625 0 1.125-.469 1.125-1.093s-.469-1.125-1.063-1.125c-4.438 0-8.062-3.594-8.062-8.031-.032-.688-.5-1.188-1.125-1.188zm.838 3.733c-.592.031-1.057.5-1.057 1.094 0 3.437 2.813 6.25 6.25 6.25.594 0 1.063-.469 1.063-1.063s-.469-1.094-1.063-1.094c-2.266 0-4.125-1.828-4.125-4.093 0-.626-.476-1.115-1.068-1.094z" />
                </svg>
              </div>
              <div>
                <strong>Twilio:</strong> API for voice, messaging, and verification services
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" height="20" width="20" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-.307-.307-.643-.643c4.389-4.376 5.18-4.418 5.996-3.753zm-4.863 4.861l4.44-4.44a.62.62 0 0 1 .848.015c.264.265.296.634.07.903l-4.393 4.394-.965-.872zm-2.288 2.448l-1.215 1.213-1.317-1.31 1.951-1.953.581.584.643.643c-.012.013.359.323-.643.823zm-2.05 2.049l1.21-1.209 1.311 1.31-2.52 2.521z"></path></svg>
              </div>
              <div>
                <strong>Google Document AI:</strong> For optical character recognition and document processing
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-red-400 flex items-center">
          <span className="text-3xl mr-2">🔒</span> Security & Infrastructure
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-300">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>JWT-based authentication</div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>End-to-end encryption for sensitive data</div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>AWS cloud infrastructure</div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>Serverless architecture</div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>HIPAA and GDPR compliance</div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>CI/CD pipeline with GitHub Actions</div>
          </li>
        </ul>
      </motion.div>
    </motion.section>
  );

  const Benefits = () => (
    <motion.section variants={titleVariants} className="my-12 w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300">
        Key Benefits
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gray-800/70 backdrop-blur rounded-xl p-6 border border-gray-700 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
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
          <a href="https://docufy.ajnasnb.com" target="_blank" rel="noopener noreferrer">
            <span className="block py-3 px-8 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              Visit Docufy.ajnasnb.com
            </span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderComponent = (componentName: string) => {
    switch (componentName) {
      case 'ProblemSolution':
        return <ProblemSolution />;
      case 'Workflow':
        return <Workflow />;
      case 'TechStack':
        return <TechStack />;
      case 'MarketReach':
        return <MarketReach />;
      case 'BusinessModel':
        return <BusinessModel />;
      case 'Benefits':
        return <Benefits />;
      case 'CallToAction':
        return <CallToAction />;
      default:
        return null;
    }
  };

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
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-grow"
          >
            {currentSlide === 0 && (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-16 px-4">
                <motion.h1 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4"
                >
                  {slides[0].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl"
                >
                  {slides[0].subtitle}
                </motion.p>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  <Image 
                    src="/assets/logo-removebg-preview.png" 
                    alt="Docufy Logo"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                </motion.div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[1].component)}
              </div>
            )}
            
            {currentSlide === 2 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[2].component)}
              </div>
            )}
            
            {currentSlide === 3 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[3].component)}
              </div>
            )}
    
            {currentSlide === 4 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[4].component)}
              </div>
            )}
    
            {currentSlide === 5 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[5].component)}
              </div>
            )}
    
            {currentSlide === 6 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[6].component)}
              </div>
            )}
     
            {currentSlide === 7 && (
              <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
                {renderComponent(slides[7].component)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

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