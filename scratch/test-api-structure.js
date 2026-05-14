async function test() {
  const res = await fetch('https://destbackdev.aggility.io/api/v1/proposals');
  const data = await res.json();
  const all = Array.isArray(data) ? data : (data.data || []);
  console.log(JSON.stringify(all[0], null, 2));
}
test();
