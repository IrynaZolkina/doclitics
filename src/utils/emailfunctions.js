// utils/maskEmail.js

export function maskEmail(email) {
  if (!email || !email.includes("@")) return email;

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 2) {
    return localPart[0] + "*****@" + domain;
  }

  const visible = localPart.slice(0, 2);
  const hidden = "*".repeat(localPart.length - 2);

  return `${visible}${hidden}@${domain}`;
}
