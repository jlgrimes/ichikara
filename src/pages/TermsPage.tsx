/**
 * Terms of Service — in-app view
 *
 * QRT-184: Required for App Store submission.
 * Mirrored at ichikara.app/terms (public/terms.html).
 */

import { Navbar, Page, PageContent } from '../lib/ui';

const EFFECTIVE_DATE = 'February 21, 2026';
const CONTACT_EMAIL  = 'hello@ichikara.app';

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

export function TermsPage() {
  return (
    <Page>
      <Navbar title="Terms of Service" />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 pb-12 space-y-8">

          {/* Header */}
          <div className="pt-2 pb-2 space-y-1">
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Effective {EFFECTIVE_DATE}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              These Terms of Service ("Terms") govern your use of Ichikara, developed by Qrtz.
              By using the App, you agree to these Terms.
            </p>
          </div>

          <Section title="1. The App">
            <p>
              Ichikara is a Japanese language-learning app. It provides grammar lessons, quiz
              drills, SOS phrases, and a bookmark system. The App is provided free of charge.
            </p>
            <p>
              We may modify, suspend, or discontinue the App (or any part of it) at any time
              without notice. We won't be liable to you or any third party for any modification
              or discontinuation.
            </p>
          </Section>

          <Section title="2. Your Account">
            <p>
              To use the App you must create an account with a valid email address. You're
              responsible for maintaining the confidentiality of your credentials. Notify us
              immediately at{' '}
              <span className="font-mono text-[var(--color-accent)]">{CONTACT_EMAIL}</span>{' '}
              if you suspect unauthorized access.
            </p>
            <p>
              You must be at least 13 years old (16 in the EU) to use the App. By creating an
              account you confirm you meet this requirement.
            </p>
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code</li>
              <li>Use automated tools to scrape, harvest, or extract curriculum content</li>
              <li>Impersonate other users or Qrtz staff</li>
              <li>Interfere with or disrupt the App's infrastructure</li>
            </ul>
          </Section>

          <Section title="4. Intellectual Property">
            <p>
              All curriculum content, lesson text, UI design, and code are owned by Qrtz or
              licensed to us. Your use of the App does not transfer any ownership rights to you.
            </p>
            <p>
              You retain ownership of any content you create within the App (notes, custom lists —
              future features). By submitting user-generated content, you grant us a non-exclusive
              license to display it within the App.
            </p>
          </Section>

          <Section title="5. No Warranty">
            <p>
              The App is provided <strong>"as is"</strong> without warranties of any kind, express
              or implied — including but not limited to accuracy of language content, uninterrupted
              availability, or fitness for a particular purpose.
            </p>
            <p>
              Language learning results vary. We make no guarantees about JLPT pass rates or
              fluency outcomes.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Qrtz shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of
              (or inability to use) the App.
            </p>
            <p>
              Our total liability for any claim arising from these Terms or your use of the App
              shall not exceed USD $10.
            </p>
          </Section>

          <Section title="7. Termination">
            <p>
              We may suspend or terminate your account at any time if you violate these Terms.
              You may delete your account at any time by contacting us. Upon termination, these
              Terms continue to apply to prior use.
            </p>
          </Section>

          <Section title="8. Governing Law">
            <p>
              These Terms are governed by the laws of the State of Illinois, USA, without regard
              to its conflict-of-law provisions. Any disputes shall be resolved in the courts of
              Cook County, Illinois.
            </p>
          </Section>

          <Section title="9. Changes">
            <p>
              We may update these Terms. Material changes will be announced via in-app notice.
              Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions? Email us at{' '}
              <span className="font-mono text-[var(--color-accent)]">{CONTACT_EMAIL}</span>.
            </p>
          </Section>

        </div>
      </PageContent>
    </Page>
  );
}
