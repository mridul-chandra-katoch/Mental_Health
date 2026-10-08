import React from 'react';

const features = [
  {
    emoji: '🧪',
    name: 'Mental Health Assessment',
    description: 'Check your mental wellbeing with a quick and confidential quiz powered by AI.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    emoji: '📓',
    name: 'Write Personal Journals',
    description: 'Track your mood and thoughts in a secure, private journal for self-reflection.',
    color: 'bg-indigo-50 border-indigo-100',
    iconBg: 'bg-indigo-100',
  },
  {
    emoji: '🤖',
    name: '1:1 Chat with AI Therapist',
    description: 'Get 24/7 support from an AI therapist to help manage your mental health.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    emoji: '💬',
    name: 'Anonymous Sharing',
    description: 'Connect with a supportive community anonymously and share your experiences freely.',
    color: 'bg-pink-50 border-pink-100',
    iconBg: 'bg-pink-100',
  },
];

const Home3 = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
            Everything You Need
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Unlocking Well-being Excellence</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A complete toolkit to track your mental health, write journals, chat anonymously, and get personalized AI-powered insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.name}
              className={`rounded-2xl border p-6 ${feature.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center text-2xl mb-4`}>
                {feature.emoji}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 p-10 text-center shadow-2xl shadow-purple-200">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-10 text-6xl">🧠</div>
            <div className="absolute bottom-4 right-10 text-6xl">💜</div>
            <div className="absolute top-1/2 left-1/4 text-4xl">✨</div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">Start Your Wellness Journey Today</h3>
          <p className="text-purple-100 mb-6 text-lg">Join thousands of people prioritizing their mental health.</p>
          <a href="/signup"
            className="inline-block px-8 py-3.5 rounded-xl bg-white text-purple-600 font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Get Started Free →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home3;
