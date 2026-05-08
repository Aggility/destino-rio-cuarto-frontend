
async function test() {
  try {
    const res = await fetch('https://destbackdev.aggility.io/api/v1/proposals?include=addresses,calendars&per_page=1');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
