import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const AnonymousPost = () => {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem('tokenUser');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/createAnonymousPosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user}` },
        body: JSON.stringify({ title, article, tags: tags.split(',').map(t => t.trim()).filter(Boolean) })
      });
      if (response.ok) navigate(`/${user}/allanonymousposts`);
    } catch (error) {
      console.error('Error:', error);
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
              <span className="text-3xl">✍️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Anonymously</h1>
            <p className="text-gray-500">Your identity stays hidden — express yourself freely</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-xl shadow-purple-100 p-8">
            {/* Anonymous badge */}
            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-lg">🎭</span>
              <p className="text-sm text-purple-700 font-medium">Posting as Anonymous — your identity is completely hidden</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="Give your post a title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Story <span className="text-red-400">*</span></label>
                <textarea value={article} onChange={e => setArticle(e.target.value)} required rows={6}
                  placeholder="Share your thoughts, feelings, or experiences..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" />
                <p className="text-xs text-gray-400 mt-1">{article.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags <span className="text-gray-400 font-normal">(optional, comma separated)</span></label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="e.g. anxiety, stress, hope"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                {tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setTitle(''); setArticle(''); setTags(''); }}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  Clear
                </button>
                <button type="submit" disabled={loading || !title || !article}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50">
                  {loading ? 'Posting...' : 'Post Anonymously 🎭'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnonymousPost;
