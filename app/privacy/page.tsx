import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { Note, P, UL, type LegalSection } from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Glycotrac stores, why, who can see it, and how you can download or delete it.",
};

const who = SITE.operator || "The people who run Glycotrac";

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <P>
          Glycotrac is a medication reminder and health log for people living with diabetes. {who} runs it and is
          responsible for your information (in some countries this is called the &ldquo;controller&rdquo;).
        </P>
        <P>
          Glycotrac records what you enter and sends you reminders. It is not a healthcare provider and does not give
          medical advice.
        </P>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <P>Only what is needed to run the app:</P>
        <UL
          items={[
            "Your email address, an optional first name, and your password (stored scrambled, never as plain text).",
            "Health information you choose to enter: medications, doses and times, pill counts, which doses you took, blood sugar and blood pressure readings, symptoms, appointments, and your settings.",
            "Your emergency card: your name, conditions, allergies, doctor details and notes, plus the names and phone numbers of the contacts you add.",
            "If you turn on reminders: a code that identifies your phone or browser to its notification service. It is not your phone number.",
            "The words you type into the medicine search.",
            "Basic technical records our hosting provider keeps to run and protect the site, such as your IP address and the time of a request.",
          ]}
        />
        <P>Health information is especially sensitive. We only collect it because you choose to enter it.</P>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it, and why we are allowed to",
    body: (
      <>
        <UL
          items={[
            "To show you your doses, work out when you will run out of pills, and show your readings and summaries.",
            "To send the reminders you asked for.",
            "To text an emergency contact if a dose stays unlogged, but only for contacts you add, who you have confirmed agreed to be contacted, and who you chose to notify.",
            "To keep your account and the service secure, and to fix problems.",
          ]}
        />
        <P>We rely on these grounds:</P>
        <UL
          items={[
            <>
              <strong className="font-medium">Your consent</strong> for the health information you enter. You give it when
              you create your account and choose to add information, and you can take it back at any time by deleting the
              information or your account.
            </>,
            <>
              <strong className="font-medium">Providing the service you asked for</strong>, such as your login and your
              reminders.
            </>,
            <>
              <strong className="font-medium">Keeping things secure</strong> and meeting legal duties.
            </>,
          ]}
        />
        <P>
          We do not sell your information, we do not share it for advertising, and we do not make automated decisions about
          you that have legal or similar effects.
        </P>
      </>
    ),
  },
  {
    id: "see",
    title: "Who can see it",
    body: (
      <>
        <P>
          You can, when you are logged in. The database separates every account&apos;s records, so one account cannot read
          another&apos;s.
        </P>
        <P>
          Your emergency contacts only receive a short text saying that you have not confirmed a dose and asking them to
          check on you. It does not include your medicines or readings.
        </P>
        <P>
          The people who run Glycotrac can technically reach the database to keep the service working. We only do so to
          run, secure and repair the service.
        </P>
      </>
    ),
  },
  {
    id: "providers",
    title: "Services we rely on",
    body: (
      <>
        <P>Glycotrac is built on other companies&apos; services. Each one handles part of your information:</P>
        <UL
          items={[
            "Supabase stores the database and handles logging in.",
            "Vercel hosts the website.",
            "Your phone or browser's own notification service (for example Google, Apple or Mozilla) delivers reminders, if you turn them on.",
            "Termii sends text messages to the emergency contacts you add. They receive the contact's phone number and the message.",
            "The US National Library of Medicine's RxNorm service receives the words you type into the medicine search, with nothing else attached.",
          ]}
        />
        <P>We only use providers to run Glycotrac. They are not allowed by us to use your information for their own purposes.</P>
      </>
    ),
  },
  {
    id: "abroad",
    title: "Sending information abroad",
    body: (
      <>
        <P>
          Some of these providers run servers in other countries, so your information may be stored or processed outside the
          country where you live. Where the law requires safeguards for this, we put them in place.
        </P>
      </>
    ),
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: (
      <>
        <P>
          We keep your information for as long as you have an account. When you delete your account, your records and login
          are removed straight away. Our hosting provider&apos;s routine backups may hold a copy for a short time afterwards
          before they expire. Technical records are kept only for as long as needed to run and secure the service.
        </P>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights, wherever you live",
    body: (
      <>
        <P>
          Depending on where you live, laws such as the Nigeria Data Protection Act, the EU and UK GDPR, and privacy laws
          in US states like California give you rights over your information. Whatever the law where you are, we aim to
          give everyone these:
        </P>
        <UL
          items={[
            <>
              <strong className="font-medium">Access and take a copy.</strong> In{" "}
              <Link href="/dashboard/settings" className="font-medium underline">
                Settings
              </Link>
              , under &ldquo;Your data&rdquo;, you can download everything we hold about you in a portable file.
            </>,
            <>
              <strong className="font-medium">Correct it.</strong> Edit or delete any medication, reading, symptom,
              appointment or contact in the app.
            </>,
            <>
              <strong className="font-medium">Delete it.</strong> Delete your whole account and all its records in
              Settings. This cannot be undone.
            </>,
            <>
              <strong className="font-medium">Withdraw consent and object.</strong> Turn off reminders, remove an
              emergency contact, or delete your account.
            </>,
            <>
              <strong className="font-medium">Ask questions or complain.</strong> Contact us, or contact your local data
              protection authority, such as the Nigeria Data Protection Commission, your national authority in the EU or
              UK, or your state attorney general in the US.
            </>,
          ]}
        />
        <P>We do not charge for these and we will not treat you worse for using them.</P>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <UL
          items={[
            "Everything travels over an encrypted connection.",
            "Passwords are stored scrambled.",
            "The database only returns each account its own records.",
            "Deleting your account needs your password again.",
          ]}
        />
        <P>
          No system is perfectly safe. Keep your password private and tell us straight away if you think someone else has
          used your account. If a security problem is likely to harm you, we will tell you and the authorities as the law
          requires.
        </P>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technology",
    body: (
      <P>
        We only use what is essential: cookies that keep you logged in, and small settings stored in your browser, such as
        whether the side menu is collapsed. We do not use advertising or tracking cookies, or analytics tools.
      </P>
    ),
  },
  {
    id: "provider",
    title: "Not a healthcare provider",
    body: (
      <>
        <P>
          Glycotrac is a personal record-keeping and reminder tool. It is not a doctor, hospital, pharmacy or health plan,
          so laws that apply only to those organisations (for example HIPAA in the United States) do not generally apply to
          it. We protect your information carefully anyway.
        </P>
        <Note>Always follow your doctor&apos;s or pharmacist&apos;s instructions. See the Terms for more.</Note>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        Glycotrac is made for adults aged 18 and over and is not designed for children to use on their own. If we learn we
        hold a child&apos;s information without a parent or guardian&apos;s permission, we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this page",
    body: (
      <P>
        If we change how we handle your information, we will update this page and the date at the top. If a change affects
        you in a big way, we will also tell you inside the app before it applies.
      </P>
    ),
  },
];

if (SITE.contactEmail) {
  sections.push({
    id: "contact",
    title: "Contact us",
    body: (
      <P>
        Questions, or want help with a request about your information? Email{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="font-medium underline">
          {SITE.contactEmail}
        </a>
        .
      </P>
    ),
  });
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      current="privacy"
      kicker="Your information"
      title="Privacy"
      intro="Glycotrac holds health information, so here is plainly what it keeps and why, who can see it, and how you can take it back."
      updated={SITE.updated}
      summary={[
        "Only you can see your records. We never sell them and there are no adverts.",
        "We store only what you enter, plus what is needed to send your reminders.",
        "You can download everything we hold about you, any time, in Settings.",
        "You can delete your account and all your records, any time, in Settings.",
      ]}
      sections={sections}
    />
  );
}
