import { useState } from "react";
import { ChevronRight, Upload, BarChart3, FileText, Share2, CheckCircle, ArrowRight, Shield } from "lucide-react";

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      title: "Upload Log Files",
      description: "Drag and drop your log files or click to browse. We support .log, .txt, and various formats.",
      icon: Upload,
      features: [
        "Support for multiple log formats",
        "Drag & drop interface",
        "Secure file upload to cloud storage",
        "Automatic format detection"
      ],
      color: "blue"
    },
    {
      title: "Automated Analysis",
      description: "Our AI-powered system analyzes your logs for patterns, errors, and security threats.",
      icon: BarChart3,
      features: [
        "Real-time log parsing",
        "IP frequency analysis",
        "Error & warning detection",
        "Suspicious activity identification"
      ],
      color: "green"
    },
    {
      title: "Generate Reports",
      description: "Get comprehensive reports with visualizations and actionable insights.",
      icon: FileText,
      features: [
        "Interactive charts & graphs",
        "Detailed statistics",
        "Export to PDF format",
        "Historical data comparison"
      ],
      color: "purple"
    },
    {
      title: "Share & Collaborate",
      description: "Share reports with your team via email or secure links for better collaboration.",
      icon: Share2,
      features: [
        "Email report sharing",
        "Secure link generation",
        "Team collaboration",
        "Access control & permissions"
      ],
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-950"
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        hover: "hover:bg-green-50 dark:hover:bg-green-950"
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-950"
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        hover: "hover:bg-orange-50 dark:hover:bg-orange-950"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how our secure log analyzer transforms your log files into actionable insights 
            in just four simple steps. From upload to collaboration, we've streamlined the entire process.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-8 mb-12">
          {workflowSteps.map((step, index) => {
            const colors = getColorClasses(step.color);
            const Icon = step.icon;
            
            return (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${colors.border} transition-all duration-300 hover:shadow-xl ${colors.hover}`}
              >
                <div className="flex items-start gap-6">
                  {/* Step Number & Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        Step {index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -bottom-4 left-8">
                    <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="absolute top-8 -left-3">
                      <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500 transform rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of developers and system administrators who trust our log analyzer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Analyzing
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              99.9% Accuracy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI algorithms ensure precise log analysis and threat detection
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant insights as soon as you upload your log files
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Enterprise Security
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Bank-level encryption and secure cloud storage for your sensitive data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}