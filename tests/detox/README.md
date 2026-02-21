# Detox — iOS Native E2E Tests

> **Status:** Scaffold only. Detox requires macOS + Xcode + a physical device or simulator.
> These tests are intended to run in CI via a GitHub Actions macOS runner or locally on Jared's Mac.

## Why Detox?

Playwright covers the **web** (desktop browser emulating iPhone viewport).
Detox covers the **native Capacitor WebView** — catches iOS-specific issues like:

- `safe-area-inset` rendering
- Haptic feedback calls (can't verify via Playwright)
- WebView scroll physics vs. DOM scroll
- Native keyboard interaction
- `@capacitor/haptics` not crashing on iOS

## Prerequisites

```bash
# On macOS only
brew install applesimutils
npm install -g detox-cli
npx detox init -r jest
```

Install Xcode from App Store, then install simulators via Xcode > Settings > Platforms.

## Setup

1. Open the Xcode project: `ios/App/App.xcworkspace`
2. Build once for simulator: `npx cap build ios`
3. Run tests:

```bash
# Build Detox test binary (first time + after native changes)
detox build --configuration ios.sim.debug

# Run all tests
detox test --configuration ios.sim.debug

# Run a specific test
detox test --configuration ios.sim.debug tests/detox/navigation.test.js
```

## Test Coverage Plan

| File | What it covers |
|------|---------------|
| `auth.test.ts` | Sign in, sign up, sign out |
| `navigation.test.ts` | Tab bar taps, slide animations |
| `lessons.test.ts` | Scroll lesson list, tap into lesson |
| `quiz.test.ts` | Flashcard flip, Got it / Again |
| `sos.test.ts` | SOS category tap, fullscreen overlay |
| `haptics.test.ts` | Verify no crashes on haptic calls |
| `safe-area.test.ts` | Content not hidden behind notch/home bar |

## Configuration

Add to `package.json`:

```json
{
  "detox": {
    "configurations": {
      "ios.sim.debug": {
        "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/App.app",
        "build": "xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
        "type": "ios.simulator",
        "device": {
          "type": "iPhone 15"
        }
      }
    },
    "testRunner": {
      "args": { "$0": "jest", "config": "tests/detox/jest.config.js" },
      "jest": { "setupTimeout": 120000 }
    }
  }
}
```

## Notes

- Tests are skipped in Playwright runs (separate `test:e2e:ios` script)
- Detox uses `@testing-library/jest-native` matchers
- Auth state: Detox injects localStorage via `device.setURLBlacklist` + native bridge
- For CI: use a self-hosted macOS runner or `macos-latest` GitHub Actions runner with Xcode 16
