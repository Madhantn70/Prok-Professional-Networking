import React, { useState } from 'react';

interface Experience {
  role: string;
  company: string;
  years: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  years: string;
}

interface Contact {
  email: string;
  phone: string;
}

interface User {
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contact: Contact;
}

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [showExp, setShowExp] = useState(false);
  const [showEdu, setShowEdu] = useState(false);

  return (
    <div style={{ marginTop: 32 }}>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Bio</h3>
        <p>{user.bio}</p>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {user.skills.map((skill: string) => (
            <span key={skill} style={{ background: '#e0e7ff', padding: '4px 12px', borderRadius: 16 }}>{skill}</span>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowExp(v => !v)}>
          Work Experience {showExp ? '\u25b2' : '\u25bc'}
        </h3>
        {showExp && (
          <ul>
            {user.experience.map((exp: Experience, i: number) => (
              <li key={i}>
                <b>{exp.role}</b> at {exp.company} ({exp.years})
                <div style={{ color: '#666' }}>{exp.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowEdu(v => !v)}>
          Education {showEdu ? '\u25b2' : '\u25bc'}
        </h3>
        {showEdu && (
          <ul>
            {user.education.map((edu: Education, i: number) => (
              <li key={i}>
                <b>{edu.degree}</b> at {edu.institution} ({edu.years})
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 style={{ fontWeight: 600 }}>Contact</h3>
        <div>Email: {user.contact.email}</div>
        <div>Phone: {user.contact.phone}</div>
      </section>
    </div>
  );
} 