import React, { useState } from 'react';
import { useToast } from '../contexts/AppContext';

// Define the job listing type
type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

const Careers = () => {
  const { showToast } = useToast();
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: ''
  });

  // Sample job listings
  const jobListings: JobListing[] = [
    {
      id: 1,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA (Remote Option)",
      type: "Full-Time",
      description: "We're looking for a talented Full Stack Developer to join our engineering team. You'll work on developing and maintaining our booking platform, implementing new features, and optimizing performance.",
      requirements: [
        "3+ years of experience in web development",
        "Proficiency in React.js, TypeScript, and Node.js",
        "Experience with RESTful APIs and database design",
        "Understanding of cloud services (AWS/Azure/GCP)",
        "Excellent problem-solving skills and attention to detail"
      ],
      responsibilities: [
        "Develop and maintain our web applications",
        "Collaborate with designers to implement UI/UX improvements",
        "Write clean, maintainable, and efficient code",
        "Troubleshoot and fix bugs",
        "Participate in code reviews and contribute to technical decisions"
      ]
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Product",
      location: "Remote",
      type: "Full-Time",
      description: "Join our product team as a UX/UI Designer to create beautiful, intuitive user experiences for our hotel booking platform. You'll work closely with product managers and developers to bring designs to life.",
      requirements: [
        "3+ years of experience in UX/UI design",
        "Proficiency in design tools (Figma, Sketch, Adobe XD)",
        "Portfolio demonstrating strong visual design skills",
        "Experience designing responsive web applications",
        "Understanding of user-centered design principles"
      ],
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity designs",
        "Conduct user research and usability testing",
        "Develop and maintain our design system",
        "Collaborate with engineers on implementation",
        "Continuously improve the user experience based on data and feedback"
      ]
    },
    {
      id: 3,
      title: "Hotel Partnership Manager",
      department: "Business Development",
      location: "London, UK",
      type: "Full-Time",
      description: "We're seeking a Hotel Partnership Manager to expand our network of partner hotels. You'll be responsible for identifying potential partners, negotiating agreements, and maintaining strong relationships with hotels.",
      requirements: [
        "3+ years of experience in business development or account management",
        "Strong negotiation and relationship-building skills",
        "Experience in the hospitality or travel industry",
        "Excellent communication skills",
        "Ability to travel occasionally (25%)"
      ],
      responsibilities: [
        "Identify and approach potential hotel partners",
        "Negotiate partnership agreements",
        "Maintain relationships with existing hotel partners",
        "Work with our product team to improve the partner experience",
        "Analyze market trends and competitor offerings"
      ]
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-Time",
      description: "Join our marketing team to drive growth through digital channels. You'll be responsible for planning and executing marketing campaigns, analyzing performance, and optimizing our digital presence.",
      requirements: [
        "2+ years of experience in digital marketing",
        "Experience with SEO, SEM, and social media marketing",
        "Proficiency with marketing analytics tools",
        "Strong analytical and creative thinking skills",
        "Experience in travel or hospitality industry is a plus"
      ],
      responsibilities: [
        "Plan and execute digital marketing campaigns",
        "Manage SEO and SEM strategies",
        "Create and optimize content for digital channels",
        "Analyze campaign performance and provide insights",
        "Collaborate with the content team on marketing materials"
      ]
    }
  ];

  const handleJobSelect = (job: JobListing) => {
    setSelectedJob(job);
    setShowApplicationForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('application-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    showToast({ 
      message: `Application submitted for ${selectedJob?.title}! We'll review your application and contact you soon.`, 
      type: "SUCCESS" 
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: null,
      coverLetter: ''
    });
    setShowApplicationForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Careers at SunsetView.com</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Join Our Team</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          At SunsetView.com, we're passionate about connecting travelers with extraordinary experiences. 
          We're a team of diverse talents working together to transform the way people book and experience hotels.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          We're looking for passionate, creative, and driven individuals to join our growing team. 
          If you're excited about travel technology and want to make a difference in how people 
          discover and book beautiful places to stay, we'd love to hear from you.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg shadow-md p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Why Work With Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Meaningful Work</h3>
            <p>Help people discover and experience the most beautiful sunset views around the world.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Growth Opportunities</h3>
            <p>We're growing fast, creating plenty of opportunities to learn and advance your career.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Remote-Friendly</h3>
            <p>Many of our positions offer remote work options, giving you flexibility in where you work.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Competitive Benefits</h3>
            <p>We offer competitive salaries, health benefits, and a generous paid time off policy.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Travel Perks</h3>
            <p>Enjoy discounts on hotel bookings and occasional team retreats to beautiful destinations.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-sm backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Collaborative Culture</h3>
            <p>Work with passionate, talented colleagues in a supportive and inclusive environment.</p>
          </div>
        </div>
      </div>
      
      {/* Job Detail or Job Listings */}
      {selectedJob ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <button 
            onClick={() => setSelectedJob(null)} 
            className="text-orange-500 mb-4 flex items-center hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all jobs
          </button>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                {selectedJob.department}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedJob.location}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedJob.type}
              </span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{selectedJob.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {selectedJob.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Requirements</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {selectedJob.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          {!showApplicationForm && (
            <button 
              onClick={handleApplyClick}
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
            >
              Apply for this Position
            </button>
          )}
          
          {showApplicationForm && (
            <div id="application-form" className="mt-8 border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Application Form</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                  </p>
                </div>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  ></textarea>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Open Positions</h2>
          
          <div className="space-y-4">
            {jobListings.map(job => (
              <div 
                key={job.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer"
                onClick={() => handleJobSelect(job)}
              >
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                    {job.department}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {job.type}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                
                <div className="flex justify-end">
                  <span className="text-orange-500 font-medium flex items-center text-sm">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Don't See a Role That Fits?</h2>
        <p className="text-gray-700 mb-4">
          We're always looking for talented individuals to join our team. If you don't see a role that
          matches your skills but believe you'd be a great fit for SunsetView.com, send us your resume 
          and a cover letter explaining why you'd like to join us.
        </p>
        <a 
          href="mailto:careers@sunsetview.com" 
          className="inline-block bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
        >
          Contact Our Recruiting Team
        </a>
      </div>
    </div>
  );
};

export default Careers;