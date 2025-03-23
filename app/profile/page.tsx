'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useHealthRecords } from '../hooks/useHealthRecords';

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { records } = useHealthRecords();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'activity'>('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
    
    // Set form data if user is loaded
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      }));
    }
  }, [isAuthenticated, loading, router, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://docxbackend.ajnasnb.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Profile updated successfully');
        setIsEditing(false);
        
        // Update user data in context by refreshing the page
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      
      if (response.ok) {
        toast.success('Password changed successfully');
        setIsChangingPassword(false);
        
        // Clear password fields
        setFormData(prevState => ({
          ...prevState,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-1 text-gray-400">
              Manage your account information and settings
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm backdrop-filter border border-gray-700">
          {/* Profile Info Banner */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="absolute -bottom-16 left-6">
              <div className="h-32 w-32 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center overflow-hidden">
                <span className="text-5xl font-bold text-gray-300">{user.name?.charAt(0).toUpperCase() || '?'}</span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-20 px-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`pb-4 px-1 font-medium text-sm ${
                    activeTab === 'personal'
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 px-1 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 px-1 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                          Full Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md ${
                              formErrors.name ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                          Email Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md ${
                              formErrors.email ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.email && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                          Phone Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                          Date of Birth
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Full Name</h3>
                        <p className="mt-1 text-base text-white">{user.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Email Address</h3>
                        <p className="mt-1 text-base text-white">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Phone Number</h3>
                        <p className="mt-1 text-base text-white">{user.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Date of Birth</h3>
                        <p className="mt-1 text-base text-white">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Account Created</h3>
                        <p className="mt-1 text-base text-white">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                          Current Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md ${
                              formErrors.currentPassword ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.currentPassword}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md ${
                              formErrors.newPassword ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.newPassword}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md ${
                              formErrors.confirmPassword ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-white">Password Security</h3>
                          <div className="mt-2 text-sm text-gray-400">
                            <p>It's a good idea to regularly update your password to keep your account secure.</p>
                            <p className="mt-2">Use a unique password with a mix of letters, numbers, and symbols.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-white">Last Password Change</h3>
                          <div className="mt-2 text-sm text-gray-400">
                            <p>Your password was last changed on: {formatDate(user.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-700 text-sm font-medium text-white">
                      Health Record Activity
                    </div>
                    
                    {records && records.length > 0 ? (
                      <div className="divide-y divide-gray-700">
                        {records.slice(0, 5).map(record => (
                          <div key={record._id} className="px-4 py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-white">{record.title}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(record.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <Link
                              href={`/records/${record._id}`}
                              className="text-xs font-medium text-blue-400 hover:text-blue-300"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-5 text-center">
                        <p className="text-sm text-gray-400">You have no health records yet.</p>
                        <Link
                          href="/upload"
                          className="mt-3 inline-block px-4 py-2 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Upload Health Record
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-700 text-sm font-medium text-white">
                      Account Activity
                    </div>
                    <div className="divide-y divide-gray-700">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-white">Profile Updated</p>
                        <p className="text-xs text-gray-400">{formatDate(user.updatedAt)}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-white">Account Created</p>
                        <p className="text-xs text-gray-400">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 