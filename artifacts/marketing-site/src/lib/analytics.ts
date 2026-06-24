export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Stub for analytics event tracking
  console.log(`[Analytics] Event Tracked: ${eventName}`, properties || {});
};
