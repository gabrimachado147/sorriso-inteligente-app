import { statsigAdapter, type StatsigUser } from '@flags-sdk/statsig';
import { flag, dedupe } from 'flags/next';
import type { Identify } from 'flags';

export const identify = dedupe((async () => ({
  userID: '1234',
})) satisfies Identify<StatsigUser>);

export const createFeatureFlag = (key: string) => {
  const baseFlag = flag<boolean, StatsigUser>({
    key,
    adapter: statsigAdapter.featureGate((gate) => gate.value, {
      exposureLogging: true,
    }),
    identify,
  });

  return async () => {
    try {
      return await baseFlag();
    } catch (err) {
      console.error(`Failed to evaluate flag ${key}`, err);
      return false;
    }
  };
};
