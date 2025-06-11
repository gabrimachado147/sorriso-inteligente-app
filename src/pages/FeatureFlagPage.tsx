import React, { useEffect, useState } from 'react';
import { createFeatureFlag } from '../statsigFlags';

const FeatureFlagPage = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    createFeatureFlag('my_feature_flag')()
      .then(setEnabled)
      .catch(() => setEnabled(false));
  }, []);

  if (enabled === null) return <div>Loading...</div>;
  return <div>myFeatureFlag is {enabled ? 'on' : 'off'}</div>;
};

export default FeatureFlagPage;
