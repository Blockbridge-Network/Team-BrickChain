"use client";

import { useState } from 'react';
import ListingForm from '../../components/listing/ListingForm';

export default function PropertyListingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8
         text-center">
          <h1 className="text-4xl font-bold text-white mb-4">List Your Property</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tokenize your real estate and make it accessible to global investors. Fill out the form below to get started.
          </p>
        </div>
        
        <ListingForm />
      </div>
    </div>
  );
}
