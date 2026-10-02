export function createNotification(message: string, time: number) {
  const notification = document.createElement("div");
  notification.className =
    "fixed inset-0 z-10 flex flex-col items-center justify-start pointer-events-none";
  notification.innerHTML = `
    <div class="min-h-10 min-w-32 max-w-2/3 p-2 mt-5 rounded-lg bg-red-500 flex justify-center items-center pointer-events-auto">
      <p class="text-lg font-bold text-white">${message}</p>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, time);
}

export function createCardNotification(message: string, color: string, time: number) {
  const notification = document.createElement("div");
  notification.className =
    `fixed inset-0 w-full h-6 flex justify-center items-center text-white`;
  notification.style.backgroundColor = color;
  notification.innerHTML = `
      <p class="font-bold text-white">${message}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, time);
}
