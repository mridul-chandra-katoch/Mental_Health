import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', gender: '', bio: '', age: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = ['username', 'password', 'name', 'email', 'gender', 'age'].filter(f => !formData[f]);
    if (missing.length > 0) { setError('Please fill in all required fields.'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (profilePicture) fd.append('profilePicture', profilePicture);

      const response = await fetch('http://localhost:4000/signup', { method: 'POST', body: fd });
      if (response.status === 409) { setError((await response.json()).msg); return; }
      if (!response.ok) throw new Error('Signup failed');
      navigate('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Username', name: 'username', type: 'text', placeholder: 'johndoe', required: true },
    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe', required: true },
    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com', required: true },
    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true },
    { label: 'Age', name: 'age', type: 'number', placeholder: '25', required: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="relative w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-100 border border-white p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
              <span className="text-3xl">🧠</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Start your mental wellness journey today</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <label htmlFor="file-upload" className="cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50 flex items-center justify-center overflow-hidden hover:border-purple-400 transition-colors group-hover:bg-purple-100">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="text-center">
                      <PhotoIcon className="w-8 h-8 text-purple-300 mx-auto" />
                      <span className="text-xs text-purple-400 mt-1 block">Upload photo</span>
                    </div>
                  )}
                </div>
                <input id="file-upload" name="profilePicture" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
              <p className="text-xs text-gray-400 mt-2">Optional profile picture</p>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              ))}

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non Binary">Non Binary</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setFormData({ username: '', password: '', name: '', email: '', gender: '', bio: '', age: '' }); setPreviewUrl(null); setError(''); }}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                Clear
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70">
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-purple-600 hover:text-purple-700">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
