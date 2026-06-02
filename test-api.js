
async function test() {
  try {
    const res = await fetch('https://destbackdev.aggility.io/api/v1/proposals/6');
    const data = await res.json();
    console.log("Keys of proposal:", Object.keys(data.data));
    console.log("Addresses count:", data.data.addresses?.length);
    console.log("Organization:", data.data.organization);
    console.log("Categories:", data.data.categories);
  } catch (e) {
    console.error(e);
  }
}
test();
