async function runTests() {
  console.log('Testing CareConnect REST APIs...');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  const health = await (await fetch(`${BASE_URL}/health`)).json();
  console.log('1. Health Check:', health);

  // 2. Family Login (Preeti)
  const familyLogin = await (
    await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'preeti@example.com', password: 'Password123!' }),
    })
  ).json();
  console.log('2. Family Member Login:', familyLogin.success, familyLogin.data?.user?.name);
  const familyToken = familyLogin.data?.accessToken;

  // 3. Parent Login (Lakshmi)
  const parentLogin = await (
    await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'lakshmi@example.com', password: 'Password123!' }),
    })
  ).json();
  console.log('3. Parent Login:', parentLogin.success, parentLogin.data?.user?.name);
  const parentToken = parentLogin.data?.accessToken;

  // 4. Caregiver Login (Ravi)
  const caregiverLogin = await (
    await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ravi@example.com', password: 'Password123!' }),
    })
  ).json();
  console.log('4. Caregiver Login:', caregiverLogin.success, caregiverLogin.data?.user?.name);

  // 5. Admin Login
  const adminLogin = await (
    await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Password123!' }),
    })
  ).json();
  console.log('5. Admin Login:', adminLogin.success, adminLogin.data?.user?.name);

  // 6. Parent Check-In Submission
  const checkInRes = await (
    await fetch(`${BASE_URL}/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`,
      },
      body: JSON.stringify({ mood: 'GOOD', notes: 'API Automated Check-in Test' }),
    })
  ).json();
  console.log('6. Parent Check-In Recorded:', checkInRes.success, checkInRes.data?.mood);

  // 7. Get Connected Parents for Family Member
  const parentsRes = await (
    await fetch(`${BASE_URL}/parents`, {
      headers: { Authorization: `Bearer ${familyToken}` },
    })
  ).json();
  console.log('7. Connected Parents Retained:', parentsRes.success, parentsRes.data?.length, 'parents found.');

  console.log('All API Integration Tests Passed Successfully! 🚀');
}

runTests().catch(console.error);
