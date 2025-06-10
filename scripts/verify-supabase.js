#!/usr/bin/env node

/**
 * Manual Supabase Verification Script
 * Run this script to test Supabase connection and schema
 * Usage: node scripts/verify-supabase.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🚀 Supabase Manual Verification Guide
=====================================

This script will guide you through manually verifying your Supabase integration.

Prerequisites:
1. Supabase project created at https://app.supabase.com
2. Database schema executed (docs/supabase-schema.sql)
3. Environment variables configured in .env.local

Let's verify each step...
`);

const questions = [
  {
    question: "✅ Have you created a Supabase project? (y/n): ",
    action: () => console.log("   👉 Go to https://app.supabase.com and create a new project")
  },
  {
    question: "✅ Have you executed the database schema from docs/supabase-schema.sql? (y/n): ",
    action: () => console.log(`   👉 Copy the contents of docs/supabase-schema.sql and execute in:
      Supabase Dashboard > SQL Editor > New Query`)
  },
  {
    question: "✅ Have you configured your .env.local file with Supabase credentials? (y/n): ",
    action: () => console.log(`   👉 Update .env.local with your actual values from:
      Supabase Dashboard > Settings > API
      
      VITE_SUPABASE_URL=your_supabase_url
      VITE_SUPABASE_ANON_KEY=your_anon_key`)
  },
  {
    question: "✅ Have you loaded sample data (optional)? (y/n): ",
    action: () => console.log("   👉 Execute docs/supabase-sample-data.sql in Supabase SQL Editor")
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function verifySetup() {
  console.log("📋 Supabase Setup Checklist:");
  console.log("=" .repeat(30));
  
  for (let i = 0; i < questions.length; i++) {
    const { question, action } = questions[i];
    const answer = await askQuestion(\`\${i + 1}. \${question}\`);
    
    if (answer !== 'y' && answer !== 'yes') {
      console.log("❌ Setup incomplete:");
      action();
      console.log("");
      continue;
    }
    
    console.log("✅ Completed!\\n");
  }
  
  console.log(\`
🎉 Supabase Setup Verification Complete!

Next Steps:
-----------
1. Test authentication in your app
2. Try creating/reading appointments
3. Verify real-time updates work
4. Test PWA offline sync

Quick Test Commands:
-------------------
# Build the app
npm run build

# Run development server
npm run dev

# Open browser to test functionality
open http://localhost:5173

Files to integrate:
------------------
- src/services/auth.ts (Authentication service)
- src/hooks/useAuth.ts (Authentication hook)
- src/services/supabase/ (Database services)
- src/hooks/useSupabase.ts (Database hooks)

Documentation:
--------------
- docs/supabase-setup-guide.md (Complete setup guide)
- docs/deployment-checklist.md (Next steps)
- docs/supabase-schema.sql (Database schema)

🚀 Ready to integrate Supabase with your PWA components!
\`);
  
  rl.close();
}

// Test current environment configuration
function testEnvironmentConfig() {
  console.log("🔍 Environment Configuration Check:");
  console.log("=" .repeat(35));
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  let allConfigured = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'your_supabase_url_here' && value !== 'your_supabase_anon_key_here') {
      console.log(\`✅ \${varName}: Configured\`);
    } else {
      console.log(\`❌ \${varName}: Not configured or using placeholder\`);
      allConfigured = false;
    }
  });
  
  if (allConfigured) {
    console.log("\\n🎉 Environment variables are properly configured!\\n");
  } else {
    console.log("\\n⚠️  Please update your .env.local file with actual Supabase values\\n");
  }
}

// Main execution
console.log("Starting Supabase verification...\\n");
testEnvironmentConfig();
verifySetup();
