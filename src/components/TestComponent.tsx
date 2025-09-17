import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          GitHub Bot Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test Component
          </h2>
          <p className="text-gray-600 mb-4">
            This is a simple test component to verify that React is working.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Research</h3>
              <p className="text-blue-700 text-sm">Repository analysis and discovery</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Commands</h3>
              <p className="text-green-700 text-sm">Command execution and history</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Operations</h3>
              <p className="text-purple-700 text-sm">Live monitoring and status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
