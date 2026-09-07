"use client";

const CHILD_SAFETY_EMAIL = "avbhelpmail@gmail.com";

const ChildSafetyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-10 sm:py-14 px-4">
        <div className="container mx-auto max-w-3xl w-full">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black text-center tracking-tight mb-2">
            Child Safety Standards
          </h1>
          <p className="text-center text-base sm:text-lg font-medium text-foreground mb-1">
            Aiswarya Matrimony
          </p>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Last updated: 7 September 2026
          </p>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-10" />

          <div className="space-y-8 text-black text-base sm:text-lg leading-relaxed">
            <p>
              Aiswarya Matrimony is committed to maintaining a safe and
              respectful environment for all users. We have zero tolerance for
              child sexual abuse and exploitation (CSAE) and child sexual abuse
              material (CSAM).
            </p>

            <p>
              Aiswarya Matrimony is a matrimonial platform intended for adults
              seeking marriage relationships. Users who are under the applicable
              minimum age for use of the service are not permitted to create or
              maintain accounts or use matchmaking and communication features.
            </p>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                1. Zero Tolerance for Child Sexual Abuse and Exploitation
              </h2>
              <p>Aiswarya Matrimony strictly prohibits:</p>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Child sexual abuse or exploitation.</li>
                <li>Sexual content involving minors.</li>
                <li>Grooming or attempts to sexually exploit minors.</li>
                <li>Sexual solicitation or communication involving minors.</li>
                <li>Sextortion or sexual extortion involving minors.</li>
                <li>
                  Sharing, uploading, requesting, or distributing CSAM.
                </li>
                <li>
                  Arranging or facilitating sexual exploitation or trafficking
                  of minors.
                </li>
                <li>
                  Any other behavior that sexually exploits, abuses, or
                  endangers children.
                </li>
              </ul>
              <p>
                Any account found to be involved in such activities may be
                immediately suspended or permanently removed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                2. Age Requirement
              </h2>
              <p>
                Aiswarya Matrimony is intended for adults seeking matrimonial
                relationships.
              </p>
              <p>
                Users must meet the minimum age requirement applicable to the
                service and applicable laws. Users who do not meet the required
                age are not permitted to use the matrimonial or communication
                services.
              </p>
              <p>
                We may take appropriate action when we identify accounts that do
                not meet our age requirements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                3. Reporting Child Safety Concerns
              </h2>
              <p>
                Users can report safety concerns through the reporting and
                support mechanisms available within Aiswarya Matrimony.
              </p>
              <p>Reports may include:</p>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Suspected child sexual exploitation.</li>
                <li>Suspected CSAM.</li>
                <li>Grooming or inappropriate contact with a minor.</li>
                <li>Suspicious profiles.</li>
                <li>Sexual solicitation involving a minor.</li>
                <li>Any other child-safety concern.</li>
              </ul>
              <p>
                When submitting a report, users should provide enough
                information for our safety team to investigate the concern.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                4. Action on Reports
              </h2>
              <p>
                Aiswarya Matrimony takes reports concerning child safety
                seriously.
              </p>
              <p>
                When we become aware of suspected CSAE or CSAM, we may:
              </p>
              <ol className="list-decimal list-outside pl-6 space-y-1.5">
                <li>Review the reported account or content.</li>
                <li>
                  Restrict or suspend the account while investigating.
                </li>
                <li>Remove prohibited content where appropriate.</li>
                <li>
                  Permanently terminate accounts that violate our policies.
                </li>
                <li>
                  Preserve relevant information where legally permitted or
                  required.
                </li>
                <li>
                  Cooperate with law enforcement and relevant authorities when
                  legally required.
                </li>
                <li>
                  Make reports to appropriate authorities where required by
                  applicable law.
                </li>
              </ol>
              <p>
                We do not permit users to use Aiswarya Matrimony to create,
                upload, request, store, distribute, or facilitate CSAM.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                5. Prohibited Content and Conduct
              </h2>
              <p>Users must not use Aiswarya Matrimony to:</p>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Share sexual content involving minors.</li>
                <li>Request sexual images or videos from minors.</li>
                <li>Contact minors for sexual purposes.</li>
                <li>
                  Encourage or facilitate sexual exploitation of children.
                </li>
                <li>
                  Share links or material facilitating child exploitation.
                </li>
                <li>
                  Impersonate or misrepresent their identity for the purpose of
                  exploiting a minor.
                </li>
                <li>
                  Engage in any activity that violates applicable child-safety
                  laws.
                </li>
              </ul>
              <p>
                Violations may result in immediate account suspension or
                permanent removal.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                6. User Safety and Moderation
              </h2>
              <p>
                Aiswarya Matrimony uses user reports, account information,
                moderation procedures, and other appropriate safety measures to
                identify and respond to violations.
              </p>
              <p>
                We encourage users to report suspicious behavior rather than
                engaging with or responding to potentially harmful accounts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                7. Child Safety Contact
              </h2>
              <p>
                For child-safety concerns, CSAE reports, or notifications
                relating to suspected CSAM, contact our designated child-safety
                team:
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${CHILD_SAFETY_EMAIL}?subject=${encodeURIComponent("Child Safety Report")}`}
                  className="text-primary underline hover:no-underline"
                >
                  {CHILD_SAFETY_EMAIL}
                </a>
                <br />
                Subject: Child Safety Report
              </p>
              <p>
                Our designated contact is responsible for receiving and
                responding to child-safety concerns and can coordinate with the
                appropriate internal team and authorities when necessary.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                8. Cooperation With Authorities
              </h2>
              <p>
                Aiswarya Matrimony will cooperate with appropriate
                law-enforcement agencies and relevant authorities in accordance
                with applicable laws and legal requirements concerning child
                sexual abuse and exploitation.
              </p>
              <p>
                Where required by applicable law, confirmed CSAM or other
                reportable child-safety incidents may be reported to the
                appropriate regional or national authority.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                9. Our Commitment
              </h2>
              <p>
                Aiswarya Matrimony is committed to preventing the use of our
                platform for child sexual abuse and exploitation.
              </p>
              <p>
                We continuously review our safety practices and take appropriate
                action against accounts and content that violate our
                child-safety standards.
              </p>
              <p>
                If you believe a child is in immediate danger, contact your
                local emergency services or appropriate law-enforcement
                authority immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Contact
              </h2>
              <p>
                Aiswarya Vivaha Bureau
                <br />
                Near Private Bus Stand,
                <br />
                Cherthala – 688524, India
              </p>
              <p>
                General Support:{" "}
                <a
                  href={`mailto:${CHILD_SAFETY_EMAIL}`}
                  className="text-primary underline hover:no-underline"
                >
                  {CHILD_SAFETY_EMAIL}
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildSafetyPage;
