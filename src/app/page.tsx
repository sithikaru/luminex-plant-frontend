export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-7xl md:text-9xl font-bold text-gray-800">
          Coming Soon
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="animate-pulse">
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded"></div>
        </div>
      </div>
    </div>
  );
}