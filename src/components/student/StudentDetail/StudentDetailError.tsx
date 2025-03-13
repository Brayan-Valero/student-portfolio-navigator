
import React from 'react';

const StudentDetailError = ({ error }: { error: string }) => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  );
};

export default StudentDetailError;
