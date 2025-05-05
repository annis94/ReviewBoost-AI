export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank You!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your review has been submitted successfully. We appreciate your feedback!
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            You can close this window now.
          </p>
        </div>
      </div>
    </div>
  );
} 