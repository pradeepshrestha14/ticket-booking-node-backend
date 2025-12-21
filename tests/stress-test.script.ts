// TEST Scenario of this stress-test:
// Pre-requisite: Make sure the server is running on localhost:4000
// Goal: Simulate multiple concurrent booking requests to book tickets of "GA" tier
// and verify that no overbooking occurs.
// Expected: Only a limited number of requests should succeed based on available inventory,
// while others should fail with "INSUFFICIENT_TICKETS" error.
// Steps:
// 1. Define the number of concurrent requests (e.g., 10 requests trying to book 3 tickets each).
// 2. Send all requests simultaneously using Promise.all.
// 3. Collect and analyze responses to ensure correctness.
// 4. Print summary of successful and failed bookings.
//
// Note:
// before running the test, ensure to
// first set "remaining_quantity" of "GA" tier to 10 in the database << table "TicketInventory" to see both success and failure cases
// now, if we send 10 concurrent requests each booking 3 tickets, we should see 3 succeed and 7 fail due to insufficient tickets

// Finally run this test file script via:
// npx ts-node-dev tests/stress-test.script.ts

import axios from "axios";

const URL = "http://localhost:4000/api/tickets/book";

const payload = {
  tier: "GA",
  quantity: 3,
};

const TOTAL_REQUESTS = 10;

async function runTest() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const requests = Array.from({ length: TOTAL_REQUESTS }).map((_, i) =>
    axios
      .post(URL, payload)
      .then((res) => ({ ok: true, status: res.status }))
      .catch((err) => ({
        ok: false,
        status: err.response?.status,
        message: err.response?.data?.error?.message,
      })),
  );

  const results = await Promise.all(requests);

  console.table(results);

  const success = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log({ success, failed });
}

runTest();
