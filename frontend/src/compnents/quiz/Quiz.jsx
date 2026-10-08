import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../navbar/Navbar';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY || '');

const questions = [
  "How often have you felt down, depressed, or hopeless in the past two weeks?",
  "How often do you feel little interest or pleasure in doing things?",
  "How often do you feel nervous, anxious, or on edge?",
  "How often do you have trouble relaxing?",
  "How often do you feel so restless that it is hard to sit still?",
  "How often do you feel fatigued or have little energy?",
  "How often do you feel bad about yourself, or that you are a failure?",
  "How often do you have trouble concentrating on things?",
  "How often do you feel afraid, as if something awful might happen?",
  "How often do you have trouble falling or staying asleep?",
  "How often do you feel easily annoyed or irritable?",
  "How often do you experience physical symptoms such as headaches or muscle pain?",
  "How often do you feel disconnected or detached from reality?",
  "How often do you find it difficult to control your worry?",
  "How often do you avoid social situations due to fear of being judged?",
];

const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

const Quiz = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const pageQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const answered = answers.filter(a => a !== '').length;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Analyze the following mental health quiz answers and generate a short summary regarding the persons mental health and what can he do, use points and headings and generate answer separated by paragraphs:\n\n${questions.map((q, i) => `${i + 1}. ${q} ${answers[i]}`).join('\n')}`;
      const result = await model.generateContent(prompt);
      let text = (await result.response.text()).replace(/\*\*(.*?)\*\*/g, '$1');
      setResult(text);
    } catch (err) {
      const msg = err?.message?.includes('429')
        ? 'Too many requests. Please wait a moment and try again.'
        : 'An error occurred while analyzing the answers.';
      setResult(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Quiz</h1>
            <p className="text-gray-500">Answer honestly — your responses are private and analyzed by AI</p>
          </div>

          {/* Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">{answered} of {questions.length} answered</span>
              <span className="text-sm font-medium text-purple-600">Page {currentPage + 1} of {totalPages}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(answered / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-6">
            {pageQuestions.map((question, idx) => {
              const globalIdx = currentPage * questionsPerPage + idx;
              return (
                <div key={globalIdx} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
                  <p className="font-semibold text-gray-800 mb-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 text-purple-600 text-sm font-bold mr-2">{globalIdx + 1}</span>
                    {question}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((option) => (
                      <label key={option}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          answers[globalIdx] === option
                            ? 'border-purple-400 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                        }`}>
                        <input type="radio" name={`q-${globalIdx}`} value={option}
                          checked={answers[globalIdx] === option}
                          onChange={() => { const a = [...answers]; a[globalIdx] = option; setAnswers(a); }}
                          className="accent-purple-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mb-6">
            {currentPage > 0 && (
              <button onClick={() => setCurrentPage(p => p - 1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                ← Previous
              </button>
            )}
            {currentPage < totalPages - 1 ? (
              <button onClick={() => setCurrentPage(p => p + 1)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || answered < questions.length}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Analyzing...' : answered < questions.length ? `Answer all questions (${questions.length - answered} left)` : 'Get My Results ✨'}
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-8 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="text-gray-500">AI is analyzing your responses...</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">✅</div>
                <h2 className="text-xl font-bold text-gray-900">Your Analysis Result</h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</div>
              <button onClick={() => { setResult(null); setAnswers(Array(questions.length).fill('')); setCurrentPage(0); }}
                className="mt-6 w-full py-3 rounded-xl border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-all">
                Take Quiz Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;
