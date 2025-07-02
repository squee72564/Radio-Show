import '@testing-library/jest-dom'

import { execSync } from "child_process";

beforeAll(() => {
  execSync("npx prisma migrate reset --force --skip-seed", { stdio: "inherit" });
});
