import { useState } from 'react';

interface ActivityItem {
  type: string;
  content: string;
  date: string;
}

interface ProfileActivityProps {
  activity: ActivityItem[];
  connections: number;
  mutualConnections: number;
}

export default function ProfileActivity({ activity, connections, mutualConnections }: ProfileActivityProps) {
  const [visible, setVisible] = useState(5);

  return (
    <div style={{ marginTop: 32 }}>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Connections</h3>
        <div>
          <b>{connections}</b> connections
          {mutualConnections > 0 && (
            <span style={{ marginLeft: 8, color: '#2563eb' }}>
              ({mutualConnections} mutual)
            </span>
          )}
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Recent Activity</h3>
        <ul>
          {activity.slice(0, visible).map((item: ActivityItem, i: number) => (
            <li key={i} style={{ marginBottom: 12 }}>
              <b>{item.type}</b>: {item.content} <span style={{ color: '#888', fontSize: 12 }}>({item.date})</span>
            </li>
          ))}
        </ul>
        {visible < activity.length && (
          <button
            onClick={() => setVisible(v => v + 5)}
            style={{ marginTop: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}
          >
            Load more
          </button>
        )}
      </section>
      <section>
        <h3 style={{ fontWeight: 600 }}>Timeline</h3>
        <ul>
          {activity.map((item: ActivityItem, i: number) => (
            <li key={i} style={{ color: '#888', fontSize: 13 }}>
              {item.date}: {item.type} - {item.content}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
} 