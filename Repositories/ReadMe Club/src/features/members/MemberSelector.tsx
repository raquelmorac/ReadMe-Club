import type { Member } from "../../types/domain";

interface MemberSelectorProps {
  members: Member[];
  value: string | null;
  onChange: (memberId: string) => void;
}

export function MemberSelector({ members, value, onChange }: MemberSelectorProps) {
  return (
    <label>
      <span className="muted">Posting as</span>
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </label>
  );
}
