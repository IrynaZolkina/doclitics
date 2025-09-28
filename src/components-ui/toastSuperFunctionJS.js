// create container if it doesn't exist
// components-ui/ToastSuper.js

export function toastSuperFunctionJS(
  message,
  type = "default",
  duration = 3000
) {
  // remove any existing toast
  const existing = document.getElementById("toast-super-overlay");
  if (existing) existing.remove();

  // overlay
  const overlay = document.createElement("div");
  overlay.id = "toast-super-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.4)";
  overlay.style.zIndex = "9998"; // just below toast box
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s ease";

  // toast box
  const toast = document.createElement("div");
  toast.id = "toast-super";
  toast.style.position = "fixed";
  toast.style.top = "50%";
  toast.style.left = "50%";
  toast.style.transform = "translate(-50%, -50%)";
  toast.style.padding = "16px 24px";
  toast.style.borderRadius = "12px";
  toast.style.color = "#fff";
  toast.style.fontSize = "16px";
  toast.style.maxWidth = "400px";
  toast.style.textAlign = "center";
  toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";
  toast.style.zIndex = "9999";

  // background color per type
  toast.style.background =
    type === "error"
      ? "#e74c3c"
      : type === "success"
      ? "#2ecc71"
      : type === "warning"
      ? "#f39c12"
      : "#333";

  toast.innerText = message;

  // add to DOM
  document.body.appendChild(overlay);
  document.body.appendChild(toast);

  // fade in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    toast.style.opacity = "1";
  });

  // auto close after duration
  setTimeout(() => {
    toast.style.opacity = "0";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      toast.remove();
    }, 300);
  }, duration);
}
