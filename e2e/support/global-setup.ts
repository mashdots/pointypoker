import { resetEmulators } from './emulator';

/**
 * Runs once before the whole suite. Wipes emulator state so every run starts
 * clean. We intentionally do NOT reset between individual tests: workers share a
 * single emulator, and each test operates on its own uniquely-named room, so a
 * per-test wipe would clobber other tests running in parallel.
 */
const globalSetup = async (): Promise<void> => {
  await resetEmulators();
};

export default globalSetup;
