import React from 'react';

const topics = [
  { name: 'ADHD', emoji: '🧩', desc: 'Attention Deficit Hyperactivity Disorder', href: 'https://applications.emro.who.int/docs/EMRPUB_leaflet_2019_mnh_214_en.pdf', from: 'from-blue-400', to: 'to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600' },
  { name: 'Depression', emoji: '🌧️', desc: 'Persistent sadness & loss of interest', href: 'https://www.who.int/news-room/fact-sheets/detail/depression', from: 'from-indigo-400', to: 'to-purple-500', light: 'bg-indigo-50', text: 'text-indigo-600' },
  { name: 'Bipolar Disorder', emoji: '⚡', desc: 'Extreme mood swings & energy shifts', href: 'https://applications.emro.who.int/docs/EMRPUB_leaflet_2019_mnh_216_en.pdf', from: 'from-purple-400', to: 'to-pink-500', light: 'bg-purple-50', text: 'text-purple-600' },
  { name: 'PTSD', emoji: '🛡️', desc: 'Post-Traumatic Stress Disorder', href: 'https://applications.emro.who.int/docs/WHOEMMNH235E-eng.pdf?ua=1', from: 'from-orange-400', to: 'to-red-500', light: 'bg-orange-50', text: 'text-orange-600' },
  { name: 'Schizophrenia', emoji: '🌀', desc: 'Disrupted thoughts & perception', href: 'https://www.who.int/news-room/fact-sheets/detail/schizophrenia', from: 'from-teal-400', to: 'to-green-500', light: 'bg-teal-50', text: 'text-teal-600' },
  { name: 'Anxiety', emoji: '💭', desc: 'Excessive worry & nervousness', href: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders', from: 'from-yellow-400', to: 'to-orange-500', light: 'bg-yellow-50', text: 'text-yellow-600' },
  { name: 'Eating Disorder', emoji: '🍃', desc: 'Unhealthy relationship with food', href: 'https://www.nimh.nih.gov/health/statistics/eating-disorders', from: 'from-pink-400', to: 'to-rose-500', light: 'bg-pink-50', text: 'text-pink-600' },
  { name: 'Paranoia', emoji: '👁️', desc: 'Irrational distrust & suspicion', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6420131/', from: 'from-violet-400', to: 'to-indigo-500', light: 'bg-violet-50', text: 'text-violet-600' },
];

const Home2 = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
            Mental Health Resources
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Learn & Understand</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Explore evidence-based information about common mental health conditions
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <a key={topic.name} href={topic.href} target="_blank" rel="noreferrer"
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Gradient Banner */}
              <div className={`w-full h-36 bg-gradient-to-br ${topic.from} ${topic.to} flex items-center justify-center`}>
                <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                  {topic.emoji}
                </span>
              </div>
              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{topic.name}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{topic.desc}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${topic.text} group-hover:gap-2 transition-all`}>
                  Read More <span>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home2;
