import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultCoverImage from './download.jpg';

const Readjournal = () => {
  const [journals, setJournals] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/${username}/journals`)
      .then(r => setJournals(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [username]);

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/journal-delete/${username}/${journalToDelete}`);
      setJournals(journals.filter(j => j._id !== journalToDelete));
      setShowDeleteModal(false);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Journals 📓</h2>
            <p className="text-gray-500 mt-1">Keep your memorable days stored with you</p>
          </div>
          <Link to={`/${username}/createjournal`}>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all">
              + New Entry
            </button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => <span key={i} className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
            </div>
          </div>
        )}

        {!loading && journals.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg">No journals yet. Start writing your first entry!</p>
            <Link to={`/${username}/createjournal`}>
              <button className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all">
                Create First Journal
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => {
            const coverImage = journal.coverPicture ? `http://localhost:4000/${journal.coverPicture}` : defaultCoverImage;
            return (
              <div key={journal._id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="relative overflow-hidden h-44">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => navigate(`/${username}/journals/${journal._id}/edit`)}
                      className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm hover:bg-white transition-all shadow-sm">
                      ✏️
                    </button>
                    <button onClick={() => { setJournalToDelete(journal._id); setShowDeleteModal(true); }}
                      className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm hover:bg-white transition-all shadow-sm">
                      🗑️
                    </button>
                  </div>
                  <span className="absolute bottom-3 left-3 text-xs text-white/80 font-medium">
                    {new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/${username}/readjournals/${journal._id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors line-clamp-2">{journal.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{journal.article}</p>
                  {journal.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {journal.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-2xl">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900">Delete Journal?</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Readjournal;
