// This is place to set up your test environment, e.g., connect to a test database, set up global variables, etc.
// for now , the necessary hooks are in the respective test files

import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

// import { prisma } from "../src/db/prisma";

beforeAll(async () => {
  //   await prisma.$connect();
});

afterEach(async () => {
  //   jest.clearAllMocks();
});

afterAll(async () => {
  //   await prisma.$disconnect();
});
