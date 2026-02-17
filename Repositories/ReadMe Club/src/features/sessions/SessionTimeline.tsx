import type { Session } from "../../types/domain";

interface SessionTimelineProps {
  sessions: Session[];
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  return (
    <ul>
      {sessions.map((session) => (
        <li key={session.id}>
          {session.sessionDateTime} ({session.pageStart}-{session.pageEnd})
        </li>
      ))}
    </ul>
  );
}
