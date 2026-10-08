import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home1 = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('tokenUser');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleGetStarted = () => {
    if (isLoggedIn && user) {
      navigate(`/${user}/profile`);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-16">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-purple-100 shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-600">Your mental wellness companion</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mindfulness
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A safe space to track your mood, chat with an AI therapist, take mental health quizzes, and share anonymously — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={handleGetStarted}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200">
            {isLoggedIn ? 'Go to Profile →' : 'Get Started Free →'}
          </button>
          <a href="/aboutus"
            className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold text-lg hover:border-purple-300 hover:text-purple-600 transition-all duration-200 shadow-sm">
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: '24/7', label: 'AI Support' },
            { value: '100%', label: 'Anonymous' },
            { value: '∞', label: 'Journals' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
};

export default Home1;
