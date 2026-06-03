
async function test() {
  try {
    // 1. Test events
    const resEvent = await fetch('http://destbackdev.aggility.io/api/v1/events');
    const events = await resEvent.json();
    const eventSlug = events.data?.[0]?.slug;
    console.log("First event slug:", eventSlug);
    if (eventSlug) {
      const resEventBySlug = await fetch(`http://destbackdev.aggility.io/api/v1/events?slug=${eventSlug}`);
      console.log("Fetch event ?slug= status:", resEventBySlug.status);
      const evData = await resEventBySlug.json();
      console.log("Event match title:", evData.data?.[0]?.title);
    }

    // 2. Test event-frameworks
    const resFrame = await fetch('https://destbackdev.aggility.io/api/v1/event-frameworks');
    const frameworks = await resFrame.json();
    const frameSlug = frameworks.data?.[0]?.slug;
    console.log("First framework slug:", frameSlug);
    if (frameSlug) {
      const resFrameBySlug = await fetch(`https://destbackdev.aggility.io/api/v1/event-frameworks?slug=${frameSlug}`);
      console.log("Fetch framework ?slug= status:", resFrameBySlug.status);
      const frData = await resFrameBySlug.json();
      console.log("Framework match title:", frData.data?.[0]?.title);
    }

    // 3. Test organizations
    const resOrg = await fetch('http://destbackdev.aggility.io/api/v1/organizations');
    const orgs = await resOrg.json();
    const orgSlug = orgs.data?.[0]?.slug;
    console.log("First org slug:", orgSlug);
    if (orgSlug) {
      const resOrgBySlug = await fetch(`http://destbackdev.aggility.io/api/v1/organizations?slug=${orgSlug}`);
      console.log("Fetch organization ?slug= status:", resOrgBySlug.status);
      const orgData = await resOrgBySlug.json();
      console.log("Org match title:", orgData.data?.[0]?.name);
    }
  } catch (e) {
    console.error(e);
  }
}
test();



