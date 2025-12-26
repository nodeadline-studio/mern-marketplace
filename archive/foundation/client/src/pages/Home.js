import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Service Marketplace</h1>
      <p className="text-lg mb-4">Find and offer professional services</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card-bg p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Browse Services</h2>
          <p className="text-light-text">Find professional services for your needs</p>
        </div>
        <div className="bg-card-bg p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Offer Services</h2>
          <p className="text-light-text">List your professional services</p>
        </div>
        <div className="bg-card-bg p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Secure Payments</h2>
          <p className="text-light-text">Safe and reliable transactions</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;