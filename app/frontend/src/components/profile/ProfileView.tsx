import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from './api';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    profileApi.getProfile()
      .then(data => {
        setUser({
          ...data.user,
          // fallback for missing fields
          location: data.user.location || 'Tirunelveli, Tamil Nadu, India',
          socials: data.user.socials || [
            { platform: "LinkedIn", url: "#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" },
            { platform: "GitHub", url: "#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { platform: "Email", url: `mailto:${data.user.email || ''}`, icon: "https://cdn-icons-png.flaticon.com/512/732/732200.png" }
          ],
          education: data.user.education || [
            {
              degree: "B.E - Electronics and Communication Engineering",
              institution: "Anna University",
              years: "2019 - 2023"
            },
            {
              degree: "Higher Secondary Education",
              institution: "Tirunelveli Government Higher Secondary School",
              years: "2017 - 2019"
            }
          ],
          contact: data.user.contact || {
            email: data.user.email || '',
            phone: "+91 98765 43210",
            location: "Tirunelveli, Tamil Nadu"
          },
          languages: data.user.languages || [
            { name: "Tamil", level: "Native" },
            { name: "English", level: "Professional" },
            { name: "Hindi", level: "Conversational" }
          ],
          connections: data.user.connections || 200,
          mutualConnections: data.user.mutualConnections || 25
        });
        setActivity(data.activity || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto p-8 text-center text-gray-700">Loading profile...</div>;
  if (error || !user) return <div className="max-w-4xl mx-auto p-8 text-center text-red-500">{error || 'No user found.'}</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow flex flex-col md:flex-row items-center md:items-start p-8 mb-8 relative">
          <div className="flex flex-col items-center md:items-start md:flex-row">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 md:mb-0 md:mr-8">
                {/* Avatar or placeholder */}
                <span className="text-5xl text-gray-400">{user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" /></svg>}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold mb-1 text-gray-900">{user.username || user.name}</h2>
              <div className="text-gray-600 mb-1">{user.title}</div>
              <div className="text-gray-500 text-sm mb-2 flex items-center"><svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{user.location}</div>
              <div className="flex space-x-3 mt-2">
                {user.socials.map((s: any) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">
                    <img src={s.icon} alt={s.platform} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <button className="absolute right-8 top-8 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
            {/* Skills */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skills || '').split(',').map((skill: string) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
            {/* Education */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Education</h3>
              <ul>
                {user.education.map((edu: any, i: number) => (
                  <li key={i} className="mb-2">
                    <div className="font-semibold">{edu.degree}</div>
                    <div className="text-gray-600 text-sm">{edu.institution}</div>
                    <div className="text-gray-400 text-xs">{edu.years}</div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
              <ul>
                {activity.map((item, i) => (
                  <li key={i} className="mb-1 text-gray-700"><b>{item.type}</b>: {item.content} <span className="text-gray-400 text-xs">({item.date})</span></li>
                ))}
              </ul>
              <button className="text-blue-600 mt-2 hover:underline">Show more activity</button>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
              <div className="text-gray-700 flex items-center mb-1"><svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H9m3 0h3" /></svg>{user.contact.email}</div>
              <div className="text-gray-700 flex items-center mb-1"><svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="17" cy="21" r="1" /></svg>{user.contact.phone}</div>
              <div className="text-gray-700 flex items-center"><svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{user.contact.location}</div>
            </div>
            {/* Languages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Languages</h3>
              <ul>
                {user.languages.map((lang: any, i: number) => (
                  <li key={i} className="flex justify-between text-gray-700"><span>{lang.name}</span><span className="text-gray-500 text-sm">{lang.level}</span></li>
                ))}
              </ul>
            </div>
            {/* Connections */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="font-semibold text-lg mb-2">Connections</h3>
              <div className="text-2xl font-bold text-blue-700 mb-1">{user.connections}+</div>
              <div className="text-gray-500">Connections</div>
              <div className="text-lg font-semibold text-blue-600 mt-2">{user.mutualConnections} <span className="text-gray-500 font-normal">Mutual</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 