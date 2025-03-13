
import React from 'react';

const StudentDetailLoading = () => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default StudentDetailLoading;
