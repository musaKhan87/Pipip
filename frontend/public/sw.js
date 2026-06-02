// Background Worker Engine for Pipip Rentals
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const mobileAlertOptions = {
      body: data.body,
      icon: data.icon || "/logo.jpeg",
      badge: data.badge || "/logo.jpeg",
      vibrate: [300, 100, 300, 100, 400], // Custom physical vibration sequence pattern on hardware
      data: { url: data.url || "/admin/notifications" },
      tag: "pipip-incoming-booking", // Groups duplicate cards cleanly
      requireInteraction: true, // Pins the message banner overlay on screen until cleared
    };

    event.waitUntil(
      self.registration.showNotification(data.title, mobileAlertOptions),
    );
  } catch (error) {
    console.error("Worker stream parsing anomaly:", error);
  }
});

// Capture action router taps on the smart notification interface sheet
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const destinationPath = event.notification.data.url;

        // If portal is open, wake it up and focus it directly
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(destinationPath) && "focus" in client) {
            return client.focus();
          }
        }
        // If terminated completely, spin open a new dedicated browser view viewport
        if (clients.openWindow) {
          return clients.openWindow(destinationPath);
        }
      }),
  );
});
