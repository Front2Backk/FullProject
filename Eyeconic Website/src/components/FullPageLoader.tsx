// components/FullPageLoader.tsx
const FullPageLoader = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading chat...</p>
    </div>
  </div>
);