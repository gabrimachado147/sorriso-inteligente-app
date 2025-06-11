import React, { useState } from 'react';
import { askGrok } from '@/integrations/xai';

export default function AIDemo() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await askGrok('What is the meaning of life?');
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={handleClick} className="px-4 py-2 bg-blue-500 text-white rounded">
        Ask Grok
      </button>
      {loading ? <p>Loading...</p> : <p>{response}</p>}
    </div>
  );
}
