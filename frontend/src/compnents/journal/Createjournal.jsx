import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const CreateJournal = () => {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [tags, setTags] = useState('');
  const [coverPicture, setCoverPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem('tokenUser');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverPicture(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('article', article);
    formData.append('tags', tags);
    if (coverPicture) formData.append('coverPicture', coverPicture);

    try {
      const response = await fetch(`http://localhost:4000/${user}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user}` },
        body: formData
      });
      if (response.ok) navigate(`/${user}/profile`);
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
              <span className="text-3xl">📓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Journal Entry</h1>
            <p className="text-gray-500">Capture your thoughts and feelings</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-xl shadow-purple-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image <span className="text-gray-400 font-normal">(optional)</span></label>
                <label htmlFor="cover-upload" className="cursor-pointer block">
                  <div className={`w-full h-40 rounded-xl border-2 border-dashed transition-all overflow-hidden ${previewUrl ? 'border-purple-300' : 'border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-purple-50'}`}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <span className="text-3xl">🖼️</span>
                        <span className="text-sm text-gray-400">Click to upload cover image</span>
                      </div>
                    )}
                  </div>
                  <input id="cover-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="What's this entry about?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Journal Entry <span className="text-red-400">*</span></label>
                <textarea value={article} onChange={e => setArticle(e.target.value)} required rows={8}
                  placeholder="Write your thoughts here... This is your safe space."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" />
                <p className="text-xs text-gray-400 mt-1">{article.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="e.g. gratitude, reflection, goals"
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
                <button type="button" onClick={() => navigate(`/${user}/profile`)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !title || !article}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Journal 📓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateJournal;
