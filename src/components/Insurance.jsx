import React from 'react';
import { Shield, Heart, Activity, Stethoscope } from 'lucide-react';

const Insurance = () => {
  const insurancePackages = [
    {
      name: 'Sehat Basic Plan',
      monthlyPrice: '2,500',
      coverage: '500,000',
      icon: Shield,
      color: 'blue',
      features: [
        'OPD coverage up to Rs. 2,000 per visit',
        'Basic lab tests coverage',
        'Emergency room coverage',
        'Medicine reimbursement up to Rs. 5,000',
        'Government hospital coverage'
      ],
      description: 'Essential coverage for individuals and families'
    },
    {
      name: 'Sehat Premium Plan',
      monthlyPrice: '5,000',
      coverage: '1,500,000',
      icon: Heart,
      color: 'purple',
      features: [
        'OPD coverage up to Rs. 3,500 per visit',
        'Specialist consultations',
        'All major lab tests covered',
        'Room coverage up to Rs. 8,000/day',
        'Dental coverage up to Rs. 25,000',
        'Maternity coverage',
        'Private hospital coverage'
      ],
      description: 'Comprehensive coverage for complete peace of mind',
      recommended: true
    },
    {
      name: 'Sehat Elite Plan',
      monthlyPrice: '10,000',
      coverage: '3,000,000',
      icon: Activity,
      color: 'emerald',
      features: [
        'Unlimited OPD visits',
        'VIP room coverage',
        'International emergency coverage',
        'All diagnostic tests covered',
        'Full dental & optical coverage',
        'Specialized treatments',
        'Air ambulance service',
        'Executive health screening'
      ],
      description: 'Premium coverage with exclusive benefits'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Health Insurance Plans</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Choose the perfect health insurance plan that suits your needs with comprehensive coverage for you and your family.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insurancePackages.map((insurance, index) => (
          <div 
            key={index} 
            className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col h-full
              ${insurance.recommended 
                ? 'bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200 shadow-lg' 
                : 'bg-white border border-gray-200 shadow-md'}`}
          >
            {insurance.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </span>
              </div>
            )}

            <div className={`w-12 h-12 rounded-full mb-6 flex items-center justify-center
              ${insurance.color === 'blue' ? 'bg-blue-100' : ''}
              ${insurance.color === 'purple' ? 'bg-purple-100' : ''}
              ${insurance.color === 'emerald' ? 'bg-emerald-100' : ''}`}
            >
              <insurance.icon 
                size={24} 
                className={`
                  ${insurance.color === 'blue' ? 'text-blue-600' : ''}
                  ${insurance.color === 'purple' ? 'text-purple-600' : ''}
                  ${insurance.color === 'emerald' ? 'text-emerald-600' : ''}`}
              />
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{insurance.name}</h2>
              <p className="text-gray-600 mb-4">{insurance.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold">Rs. {insurance.monthlyPrice}</span>
                <span className="text-gray-600">/month</span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Coverage up to</p>
                <p className="text-2xl font-bold text-gray-800">Rs. {insurance.coverage}</p>
              </div>

              <div className="space-y-3">
                {insurance.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Stethoscope size={16} className="text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mt-8
                ${insurance.recommended 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-800 text-white hover:bg-gray-900'}`}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insurance;















