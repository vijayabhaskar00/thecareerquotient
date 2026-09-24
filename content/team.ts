export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

// Intentionally empty: no real leadership names, bios, or photos have been
// supplied yet. Per the non-fabrication rule, we do not invent team members.
// Populate this array when real leadership data is available.
export const team: TeamMember[] = [];
