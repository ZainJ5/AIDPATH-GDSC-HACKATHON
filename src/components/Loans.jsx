import React from 'react';
import { Heart, Stethoscope, ClipboardList, Clock } from 'lucide-react';

const Loans = () => {
  const healthLoanPackages = [
    {
      name: 'Emergency Medical Loan',
      maxAmount: '500,000',
      interest: '8%',
      tenure: '12-24 months',
      processingFee: '1%',
      icon: Heart,
      color: 'red',
      features: [
        'Quick approval within 4 hours',
        'Minimal documentation',
        'No collateral required',
        'Direct hospital payment'
      ],
      description: 'Instant loans for emergency medical expenses',
      eligibility: 'Age 21-60 years, Min. income Rs. 25,000/month'
    },
    {
      name: 'Planned Surgery Loan',
      maxAmount: '1,500,000',
      interest: '12%',
      tenure: '12-48 months',
      processingFee: '2%',
      icon: Stethoscope,
      color: 'purple',
      features: [
        'Pre-approved amounts',
        'Flexible repayment options',
        'Coverage for all major surgeries',
        'Family coverage included'
      ],
      description: 'Plan your medical procedures with easy EMIs',
      eligibility: 'Age 21-65 years, Min. income Rs. 40,000/month',
      recommended: true
    },
    {
      name: 'Long Term Care Loan',
      maxAmount: '3,000,000',
      interest: '10%',
      tenure: '24-60 months',
      processingFee: '1.5%',
      icon: ClipboardList,
      color: 'green',
      features: [
        'Extended repayment period',
        'Comprehensive coverage',
        'Chronic illness support',
        'Regular health monitoring'
      ],
      description: 'Extended financial support for long-term medical care',
      eligibility: 'Age 21-70 years, Min. income Rs. 60,000/month'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Medical Financial Support</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Flexible healthcare financing solutions to support your medical needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {healthLoanPackages.map((loan, index) => (
          <div 
            key={index} 
            className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col h-full
              ${loan.recommended 
                ? 'bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200 shadow-lg' 
                : 'bg-white border border-gray-200 shadow-md'}`}
          >
            {loan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`w-12 h-12 rounded-full mb-6 flex items-center justify-center
              ${loan.color === 'red' ? 'bg-red-100' : ''}
              ${loan.color === 'purple' ? 'bg-purple-100' : ''}
              ${loan.color === 'green' ? 'bg-green-100' : ''}`}
            >
              <loan.icon 
                size={24} 
                className={`
                  ${loan.color === 'red' ? 'text-red-600' : ''}
                  ${loan.color === 'purple' ? 'text-purple-600' : ''}
                  ${loan.color === 'green' ? 'text-green-600' : ''}`}
              />
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{loan.name}</h2>
              <p className="text-gray-600 mb-4">{loan.description}</p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Max Amount:</span>
                  <span className="font-bold text-gray-800">Rs. {loan.maxAmount}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-bold text-gray-800">{loan.interest}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tenure:</span>
                  <span className="font-bold text-gray-800">{loan.tenure}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {loan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Clock size={16} className="text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Eligibility:</p>
                <p className="text-sm font-medium text-gray-800">{loan.eligibility}</p>
              </div>
            </div>

            <button 
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
                ${loan.recommended 
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

export default Loans;