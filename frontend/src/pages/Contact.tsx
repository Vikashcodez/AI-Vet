const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8">Last updated on Sep 16 2025</p>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p>You may contact us using the information below:</p>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Merchant Legal entity name:</h3>
              <p className="text-gray-700">Ankit Laj Acharya</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">Registered Address:</h3>
              <p className="text-gray-700">Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">Operational Address:</h3>
              <p className="text-gray-700">Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">Telephone No:</h3>
              <p className="text-gray-700">9531973175</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">E-Mail ID:</h3>
              <p className="text-gray-700">ankitlajacharya@gmail.com</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Important Note:</h3>
            <p className="text-blue-800">
              This is an AI-powered veterinary assistance tool and should not replace professional veterinary advice. 
              Always consult with a qualified veterinarian for serious health concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;