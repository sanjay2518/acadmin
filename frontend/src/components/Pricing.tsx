import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '₹199',
      duration: '/month',
      description: 'Perfect for small firms looking to get started with basic dashboard visibility.',
      features: [
        'Up to 10 Client Connections',
        'Basic Dashboard (Revenue, Expenses, Profit)',
        'Monthly Data Refresh',
        'Standard Email Support'
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '₹499',
      duration: '/month',
      description: 'Ideal for growing firms needing deeper insights and more client capacity.',
      features: [
        'Up to 50 Client Connections',
        'Advanced Dashboard & Charts',
        'Daily Data Refresh',
        'Custom Branding Options',
        'Priority Email & Chat Support'
      ],
      buttonText: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      duration: '',
      description: 'For large firms with complex needs and high volume of clients.',
      features: [
        'Unlimited Client Connections',
        'Real-time Data Refresh',
        'Custom Report Builder',
        'Dedicated Account Manager',
        'API Access & Integrations'
      ],
      buttonText: 'Contact Sales',
      popular: false,
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose the plan that fits your firm</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing that scales with your business. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? 'bg-blue-600 text-white shadow-xl scale-105 transform' 
                  : 'bg-white text-gray-900 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm h-10 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className={`text-lg ${plan.popular ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.duration}
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.popular ? 'text-blue-200' : 'text-blue-500'}`} />
                    <span className={plan.popular ? 'text-white' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-4 rounded-xl font-semibold transition-colors duration-200 ${
                  plan.popular 
                    ? 'bg-white text-blue-600 hover:bg-gray-50' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
