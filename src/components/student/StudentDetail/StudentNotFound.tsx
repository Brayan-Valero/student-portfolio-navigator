
import React from 'react';

const StudentNotFound = () => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Not Found</h2>
        <p className="text-gray-500">The requested student could not be found.</p>
      </div>
    </div>
  );
};

export default StudentNotFound;
