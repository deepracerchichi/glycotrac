import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { Note, P, UL, type LegalSection } from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The rules for using Glycotrac, in plain language.",
};

const who = SITE.operator || "the people who run Glycotrac";

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Using Glycotrac",
    body: (
      <>
        <P>
          These terms are the agreement between you and {who}. By creating an account or using Glycotrac, you agree to
          them. If you do not agree, please do not use it.
        </P>
        <P>
          You must be at least 18 and able to enter into this agreement. How we handle your information is explained on the{" "}
          <Link href="/privacy" className="font-medium underline">
            Privacy
          </Link>{" "}
          page.
        </P>
      </>
    ),
  },
  {
    id: "not-medical",
    title: "Not medical advice",
    body: (
      <>
        <Note>
          Glycotrac is a tracking tool. It cannot diagnose, interpret symptoms or recommend treatment.
        </Note>
        <UL
          items={[
            "It records what you enter and sends reminders. It is intended for keeping records and reminders, not for diagnosing or treating any condition.",
            "Any message it shows about a reading is a simple prompt, not a medical judgement.",
            "Always follow your doctor's or pharmacist's instructions. Never change or stop a medicine because of something you saw in the app.",
            "In an emergency, call your local emergency number or go to the nearest hospital. Do not wait for the app.",
          ]}
        />
      </>
    ),
  },
  {
    id: "reminders",
    title: "Reminders can fail",
    body: (
      <>
        <P>
          Reminders and text messages depend on things outside our control: your phone, its battery settings, your internet
          connection, and the notification and text-message services we use. They can arrive late or not at all.
        </P>
        <P>
          Treat Glycotrac as a helper, not a guarantee. Keep your usual routine for taking your medicine, and do not rely on
          the app alone.
        </P>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <UL
        items={[
          "Give accurate information and keep your password private.",
          "You are responsible for what happens under your account. Tell us quickly if you think someone else has got in.",
          "One account is for one person. Do not share your login.",
        ]}
      />
    ),
  },
  {
    id: "information",
    title: "Your information",
    body: (
      <>
        <P>
          The information you enter is yours. You give us permission to store and use it only to run Glycotrac for you, as
          described on the Privacy page. You can download or delete it whenever you like.
        </P>
        <P>
          You can add people who may be texted if you miss a dose. Only add someone who has agreed to be contacted, and
          confirm that in the app. You are responsible for having their permission. Do not use this feature to harass anyone
          or to send messages that are not about your own care.
        </P>
      </>
    ),
  },
  {
    id: "use",
    title: "Fair use",
    body: (
      <>
        <P>Please do not:</P>
        <UL
          items={[
            "use Glycotrac for anything unlawful,",
            "try to see another person's records, or to get around the app's security,",
            "overload the service or collect its content with automated tools,",
            "copy, resell or reverse-engineer the service, except where the law allows,",
            "pretend to be someone else.",
          ]}
        />
      </>
    ),
  },
  {
    id: "third-party",
    title: "Other companies' services",
    body: (
      <P>
        Glycotrac relies on other services, such as hosting, notifications, text messaging and the medicine search. We are
        not responsible for how those services behave, and some of the drug names and information you see come from outside
        sources that may be incomplete or out of date.
      </P>
    ),
  },
  {
    id: "ip",
    title: "Ownership",
    body: (
      <P>
        Glycotrac, including its design, text and software, belongs to {who} or its licensors. You may use it as these
        terms allow, but you do not get ownership of it. If you send us feedback, we may use it to improve the service
        without owing you anything.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to the service",
    body: (
      <P>
        Glycotrac is still being developed. We may add, change, pause or remove features, and we may introduce paid plans.
        If we plan to close the service or charge for something you already use, we will tell you first and give you time
        to download your data.
      </P>
    ),
  },
  {
    id: "ending",
    title: "Ending your account",
    body: (
      <>
        <P>
          You can stop using Glycotrac at any time. You can download your data and delete your account from{" "}
          <Link href="/dashboard/settings" className="font-medium underline">
            Settings
          </Link>
          .
        </P>
        <P>We may suspend or close an account that breaks these terms or puts the service or other people at risk.</P>
      </>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: (
      <>
        <P>
          Glycotrac is provided &ldquo;as it is&rdquo;. We work to keep it accurate and available, but we cannot promise it
          will always be free of errors or interruptions.
        </P>
        <P>
          To the fullest extent the law allows, we are not responsible for losses that result from a missed, late or
          failed reminder or text message, from a wrong or missing entry, or from a health decision made using the app.
          Nothing in these terms limits any responsibility that the law does not allow to be limited, such as for fraud
          or for death or personal injury caused by negligence.
        </P>
      </>
    ),
  },
  {
    id: "local",
    title: "Your local rights",
    body: (
      <P>
        If you live somewhere with consumer protection laws that cannot be waived by agreement, those protections still
        apply to you, whatever these terms say.
      </P>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <P>
          These terms are governed by the laws of the Federal Republic of Nigeria. If we cannot settle a disagreement by
          talking it through, the courts of Nigeria can decide it, unless the law where you live gives you the right to go
          to a local court.
        </P>
      </>
    ),
  },
  {
    id: "general",
    title: "The small print",
    body: (
      <UL
        items={[
          "If one part of these terms turns out not to be enforceable, the rest still applies.",
          "If we do not enforce a rule straight away, we have not given it up.",
          "These terms, together with the Privacy page, are the whole agreement between us about Glycotrac.",
          "We may update these terms. We will change the date at the top and tell you in the app if the change matters. If you keep using Glycotrac after a change, you accept the new terms.",
        ]}
      />
    ),
  },
];

if (SITE.contactEmail) {
  sections.push({
    id: "contact",
    title: "Contact us",
    body: (
      <P>
        Questions about these terms? Email{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="font-medium underline">
          {SITE.contactEmail}
        </a>
        .
      </P>
    ),
  });
}

export default function TermsPage() {
  return (
    <LegalLayout
      current="terms"
      kicker="The ground rules"
      title="Terms"
      intro="Plain-language rules for using Glycotrac. The most important one: it helps you keep track, and it is not a doctor."
      updated={SITE.updated}
      summary={[
        "Glycotrac is a tracking tool. It is not medical advice.",
        "Reminders can fail, so keep your normal routine too.",
        "Only add emergency contacts who have agreed to be texted.",
        "You can download your data and delete your account whenever you like.",
      ]}
      sections={sections}
    />
  );
}
