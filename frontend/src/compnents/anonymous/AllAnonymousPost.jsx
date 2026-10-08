import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const tagColors = ['bg-purple-100 text-purple-700', 'bg-indigo-100 text-indigo-700', 'bg-blue-100 text-blue-700', 'bg-pink-100 text-pink-700', 'bg-green-100 text-green-700'];

const AllAnonymousPost = () => {
  const [anonymousPosts, setAnonymousPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { username } = useParams();
  const navigate = useNavigate();
  const user = localStorage.getItem('tokenUser');

  useEffect(() => {
    axios.get('http://localhost:4000/anonymousPosts')
      .then(r => setAnonymousPosts(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = anonymousPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.article.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Anonymous Posts</h1>
            <p className="text-gray-500">Real stories, shared safely — no identity required</p>
          </div>

          {/* Search + Create */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
            </div>
            <button onClick={() => navigate(`/${user}/createanonymouspost`)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all whitespace-nowrap">
              + New Post
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map(i => <span key={i} className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && (
            <>
              <p className="text-sm text-gray-400 mb-4">{filtered.length} post{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((post, idx) => (
                  <div key={post._id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="h-1.5 bg-gradient-to-r from-purple-400 to-indigo-400" />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-lg">
                          {['💭', '💜', '🌱', '✨', '🌊'][idx % 5]}
                        </div>
                        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{post.article}</p>
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {post.tags.map((tag, i) => (
                            <span key={i} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColors[i % tagColors.length]}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <p className="text-gray-500">No posts found matching your search</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllAnonymousPost;
