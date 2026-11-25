export function getRelativeAppointmentLabel(
  lastAppointmentDate: string | null | undefined,
  labels: {
    today: string;
    yesterday: string;
    daysAgoTemplate: string;
  },
): string | null {
  if (!lastAppointmentDate) {
    return null;
  }

  const appointmentDate = new Date(lastAppointmentDate);

  if (Number.isNaN(appointmentDate.getTime())) {
    return null;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    appointmentDate.getFullYear(),
    appointmentDate.getMonth(),
    appointmentDate.getDate(),
  );
  const daysDiff = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 0) {
    return labels.today;
  }

  if (daysDiff === 1) {
    return labels.yesterday;
  }

  return labels.daysAgoTemplate.replace('{n}', String(daysDiff));
}

export function getRelationshipLabel(
  relationship: string,
  labels: {
    spouse: string;
    child: string;
    parent: string;
    sibling: string;
    grandparent: string;
    grandchild: string;
    other: string;
  },
): string {
  const map: Record<string, string> = {
    Spouse: labels.spouse,
    Child: labels.child,
    Parent: labels.parent,
    Sibling: labels.sibling,
    Grandparent: labels.grandparent,
    Grandchild: labels.grandchild,
    Other: labels.other,
  };

  return map[relationship] ?? relationship;
}
