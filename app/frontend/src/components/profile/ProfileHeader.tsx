import React from 'react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface User {
  avatar?: string;
  name: string;
  title: string;
  location: string;
  socials?: SocialLink[];
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, background: '#f5f6fa', borderRadius: 12
    }}>
      <img
        src={user.avatar || '/default-avatar.png'}
        alt="avatar"
        style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
      />
      <h2 style={{ fontSize: 28, fontWeight: 700 }}>{user.name}</h2>
      <div style={{ color: '#666', fontSize: 18 }}>{user.title}</div>
      <div style={{ color: '#888', fontSize: 16 }}>{user.location}</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        {user.socials?.map((link: SocialLink) => (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
            <img src={link.icon} alt={link.platform} style={{ width: 28, height: 28 }} />
          </a>
        ))}
      </div>
    </div>
  );
} 