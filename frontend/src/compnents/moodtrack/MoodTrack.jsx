import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Navbar from '../navbar/Navbar';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const moodLabels = ['😄', '😊', '😐', '😔', '😢'];
const moodNames = ['Great', 'Good', 'Okay', 'Low', 'Sad'];
const moodColors = ['#a78bfa', '#818cf8', '#6366f1', '#4f46e5', '#4338ca'];

const MoodTrack = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [lastMood, setLastMood] = useState(null);
  const username = localStorage.getItem('tokenUser');

  useEffect(() => {
    axios.get(`http://localhost:4000/api/moods/${username}`)
      .then(r => { setMoodData(r.data); if (r.data.length > 0) setLastMood(r.data[r.data.length - 1]); })
      .catch(e => console.error(e));
  }, [username]);

  const handleMoodSelect = (emoji) => {
    axios.post(`http://localhost:4000/api/moods/${username}`, { date: selectedDate, mood: emoji })
      .then(r => { setMoodData(prev => [...prev, r.data]); setLastMood(r.data); setIsModalOpen(false); })
      .catch(e => console.error(e));
  };

  const moodCounts = moodLabels.map(l => moodData.filter(e => e.mood === l).length);

  const chartData = {
    labels: moodLabels.map((e, i) => `${e} ${moodNames[i]}`),
    datasets: [{
      label: 'Mood Frequency',
      data: moodCounts,
      backgroundColor: moodColors.map(c => c + 'cc'),
      borderColor: moodColors,
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mood Tracker 📊</h1>
            <p className="text-gray-500">Track how you feel each day and visualize your emotional journey</p>
          </div>

          {/* Last Mood Card */}
          {lastMood && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-3xl">
                {lastMood.mood}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Last recorded mood</p>
                <p className="text-lg font-bold text-gray-800">{moodNames[moodLabels.indexOf(lastMood.mood)]}</p>
                <p className="text-sm text-gray-500">{new Date(lastMood.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          )}

          {/* Date Picker Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm">📅</span>
              Log Today's Mood
            </h2>
            <input
              type="date"
              onChange={(e) => { setSelectedDate(e.target.value); setIsModalOpen(true); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-400 mt-2">Select a date to log your mood for that day</p>
          </div>

          {/* Chart Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📈</span>
              Mood Frequency Overview
            </h2>
            <div className="h-64">
              <Bar data={chartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f3f4f6' } },
                  x: { grid: { display: false } }
                }
              }} />
            </div>
          </div>

          {/* Mood Stats */}
          <div className="grid grid-cols-5 gap-3">
            {moodLabels.map((emoji, i) => (
              <div key={emoji} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-3 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-xl font-bold text-gray-800">{moodCounts[i]}</div>
                <div className="text-xs text-gray-400">{moodNames[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
                <Dialog.Title className="text-xl font-bold text-gray-900 text-center mb-2">How are you feeling?</Dialog.Title>
                <p className="text-sm text-gray-500 text-center mb-6">Select the emoji that best describes your mood</p>
                <div className="flex justify-around">
                  {moodLabels.map((emoji, i) => (
                    <button key={emoji} onClick={() => handleMoodSelect(emoji)}
                      className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-purple-50 transition-all hover:scale-110 group">
                      <span className="text-4xl">{emoji}</span>
                      <span className="text-xs text-gray-400 group-hover:text-purple-600">{moodNames[i]}</span>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MoodTrack;
