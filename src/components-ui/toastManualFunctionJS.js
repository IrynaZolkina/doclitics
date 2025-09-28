// components-ui/ToastManual.js
export function toastManualFunctionJS(message, type = "default") {
  // remove old one if exists (only one at a time)
  // components-ui/ToastManual.js

  // remove old one if exists
  const existing = document.getElementById("toast-manual-overlay");
  if (existing) existing.remove();

  // overlay
  const overlay = document.createElement("div");
  overlay.id = "toast-manual-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.4s ease";

  // toast box
  const toast = document.createElement("div");
  toast.id = "toast-manual";
  toast.style.padding = "20px 28px";
  toast.style.borderRadius = "12px";
  toast.style.color = "#fff";
  toast.style.fontSize = "16px";
  toast.style.maxWidth = "400px";
  toast.style.textAlign = "center";
  toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s ease";
  toast.style.background =
    type === "error"
      ? "#e74c3c"
      : type === "success"
      ? "#2ecc71"
      : type === "warning"
      ? "#f39c12"
      : "#333";

  // message
  const msg = document.createElement("div");
  msg.innerText = message;

  // close button
  const btn = document.createElement("button");
  btn.innerText = "Close";
  btn.style.marginTop = "16px";
  btn.style.padding = "6px 14px";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.background = "rgba(255,255,255,0.2)";
  btn.style.color = "#fff";
  btn.style.fontSize = "15px";

  // close function
  const closeToast = () => {
    toast.style.opacity = "0";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 400);
  };

  btn.onclick = closeToast;

  // close on overlay click (but not when clicking toast itself)
  overlay.onclick = (e) => {
    if (e.target === overlay) closeToast();
  };

  toast.appendChild(msg);
  toast.appendChild(btn);
  overlay.appendChild(toast);
  document.body.appendChild(overlay);

  // fade-in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    toast.style.opacity = "1";
  });
}
