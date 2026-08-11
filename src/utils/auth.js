/**
 * Simulated Firebase Auth Provider & Role-Based Access Control (RBAC)
 */

export const AUTH_ROLES = {
  FAN: 'fan',
  OPS: 'ops',
  FOUNDER: 'founder'
};

const VIEW_PERMISSIONS = {
  home: [AUTH_ROLES.FAN, AUTH_ROLES.OPS, AUTH_ROLES.FOUNDER],
  fan: [AUTH_ROLES.FAN, AUTH_ROLES.OPS, AUTH_ROLES.FOUNDER],
  ops: [AUTH_ROLES.OPS, AUTH_ROLES.FOUNDER],
  founder: [AUTH_ROLES.FOUNDER]
};

export function determineRole(email) {
  const mail = email.toLowerCase().trim();
  if (mail.includes('founder') || mail.includes('admin') || mail.endsWith('@arenaflow.ai') || mail.endsWith('@arenaflow.com')) {
    return AUTH_ROLES.FOUNDER;
  }
  if (mail.includes('ops') || mail.includes('volunteer') || mail.includes('steward') || mail.endsWith('@stadiumops.com') || mail.endsWith('@stadium.org')) {
    return AUTH_ROLES.OPS;
  }
  return AUTH_ROLES.FAN;
}

export function hasPermission(role, view) {
  const allowedRoles = VIEW_PERMISSIONS[view] || [];
  return allowedRoles.includes(role);
}
