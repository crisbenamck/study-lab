// This file is deprecated - usage tracking removed as it's not accurate without API integration
// Keeping minimal structure for potential future API integration

export const useApiUsageTracker = () => {
  return {
    incrementUsage: () => {},
    getUsageInfo: () => ({
      currentCount: 0,
      limit: 0,
      remaining: 0,
      percentage: 0,
      isNearLimit: false,
      isAtLimit: false,
      rpm: 0
    }),
    getAllUsage: () => [],
    isLoaded: true
  };
};
