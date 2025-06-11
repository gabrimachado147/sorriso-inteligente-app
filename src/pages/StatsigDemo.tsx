import React, { useEffect, useState } from 'react';
import { createFeatureFlag } from '../flags';

export default function StatsigDemo() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    createFeatureFlag('my_feature_flag')().then(setEnabled);
  }, []);

  return <div>myFeatureFlag is {enabled ? 'on' : 'off'}</div>;
}
