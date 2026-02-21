/**
 * Privacy Policy — in-app view
 *
 * QRT-184: Required for App Store submission.
 * Mirrored at ichikara.app/privacy (public/privacy.html).
 *
 * Plain-language summary of what Ichikara collects and why.
 */

import { Navbar, Page, PageContent } from '../lib/ui';

const EFFECTIVE_DATE = 'February 21, 2026';
const CONTACT_EMAIL  = 'privacy@ichikara.app';

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">{title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function PrivacyPage() {
  return (
    <Page>
      <Navbar title="Privacy Policy" />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 pb-12 space-y-8">

          {/* Header */}
          <div className="pt-2 pb-2 space-y-1">
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Last updated {EFFECTIVE_DATE}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Ichikara ("the App") is built by Qrtz. We keep this short and honest.
            </p>
          </div>

          {/* Sections */}
          <Section title="What We Collect">
            <p>
              <strong>Account data.</strong> When you sign in, we store your email address and a
              unique user ID via Supabase Auth. Your password is never stored in plaintext — it's
              handled entirely by Supabase's secure auth system.
            </p>
            <p>
              <strong>Progress data.</strong> Your lesson completion state, quiz scores, and bookmarks
              are stored in your browser's localStorage on-device. Progress that syncs to our
              servers (future feature) would be stored in Supabase under your user ID.
            </p>
            <p>
              <strong>Usage analytics.</strong> We use PostHog to collect anonymized usage events
              (e.g. "lesson opened", "quiz completed", "tab switched"). These events help us improve
              the app. PostHog does not receive your email or any identifying information beyond an
              anonymous session ID.
            </p>
            <p>
              <strong>Error reports.</strong> We use Highlight.io to capture crash reports and
              session replays (page structure only — no keystrokes or passwords). These help us
              fix bugs faster.
            </p>
          </Section>

          <Section title="What We Don't Collect">
            <p>We do <strong>not</strong> collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name, phone number, or physical address</li>
              <li>Payment information (the app is free)</li>
              <li>Your device's contacts, camera, or microphone</li>
              <li>Your location</li>
              <li>Audio from TTS playback (speech synthesis is on-device)</li>
            </ul>
          </Section>

          <Section title="How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1">
              <li>To authenticate you and keep your account secure</li>
              <li>To sync your progress across devices (future)</li>
              <li>To understand which features are used so we can improve the app</li>
              <li>To diagnose and fix crashes</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, or share your data with third parties for
              advertising or marketing purposes.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>Ichikara uses the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase</strong> — auth and database hosting (USA). See{' '}
                <span className="font-mono text-[var(--color-accent)]">supabase.com/privacy</span>
              </li>
              <li>
                <strong>PostHog</strong> — product analytics (USA/EU). See{' '}
                <span className="font-mono text-[var(--color-accent)]">posthog.com/privacy</span>
              </li>
              <li>
                <strong>Highlight.io</strong> — error monitoring (USA). See{' '}
                <span className="font-mono text-[var(--color-accent)]">highlight.io/privacy</span>
              </li>
            </ul>
          </Section>

          <Section title="Data Retention">
            <p>
              Your account and any server-side data are retained until you delete your account.
              You can request deletion at any time by emailing us (see contact below) — we'll
              purge your data within 30 days.
            </p>
            <p>
              On-device localStorage data (quiz scores, bookmarks) is cleared when you uninstall
              the app or clear browser storage.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>
              Depending on where you live, you may have rights under GDPR (EU/UK) or CCPA
              (California) to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data ("right to be forgotten")</li>
              <li>Opt out of analytics tracking</li>
              <li>Data portability (receive your data in a machine-readable format)</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <span className="font-mono text-[var(--color-accent)]">{CONTACT_EMAIL}</span>.
            </p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              Ichikara is not directed at children under 13 (or 16 in the EU). If you believe
              a child has provided us with personal data, please contact us and we will delete it.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              If we make material changes, we'll update the "Last updated" date above and notify
              you via an in-app notice. Continued use of the app after changes constitutes
              acceptance.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions or requests? Email{' '}
              <span className="font-mono text-[var(--color-accent)]">{CONTACT_EMAIL}</span>.
            </p>
          </Section>

        </div>
      </PageContent>
    </Page>
  );
}
