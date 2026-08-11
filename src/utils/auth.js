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

export function determineRole(username) {
  const name = username.toLowerCase().trim();
  if (name.includes('founder') || name.includes('admin')) {
    return AUTH_ROLES.FOUNDER;
  }
  if (name.includes('ops') || name.includes('volunteer') || name.includes('steward')) {
    return AUTH_ROLES.OPS;
  }
  return AUTH_ROLES.FAN;
}

export function hasPermission(role, view) {
  const allowedRoles = VIEW_PERMISSIONS[view] || [];
  return allowedRoles.includes(role);
}
