"use client";

import Link from "next/link";

const ADMIN_EMAIL = "aiswarya@aiswaryamatrimonials.com";
const PHONES = [
  { display: "+91 79072 40062", tel: "+917907240062" },
  { display: "+91 62828 57276", tel: "+916282857276" },
] as const;

const DeleteMyAccountPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-10 sm:py-14 px-4">
        <div className="container mx-auto max-w-3xl w-full">
          <p className="text-center text-sm text-muted-foreground mb-2">
            Account deletion
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black text-center tracking-tight mb-2">
            Delete my account
          </h1>
          <p className="text-center text-base sm:text-lg font-medium text-foreground mb-1">
            Aiswarya Marriage Bureau
          </p>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-10" />

          <div className="space-y-8 text-black text-base sm:text-lg leading-relaxed">
            <p>
              If you no longer wish to use Aiswarya Matrimony, you can request
              permanent deletion of your account and associated personal data.
              Please contact our team using the details below — we do not offer
              instant self-service deletion at this time.
            </p>

            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Contact support to delete your account
              </h2>
              <p>
                To request deletion, email or call us with your{" "}
                <span className="font-semibold">full name</span>,{" "}
                <span className="font-semibold">registered email</span>, and{" "}
                <span className="font-semibold">phone number</span>. We will
                verify your identity before processing the request.
              </p>
              <p>
                Admin email:{" "}
                <a
                  href={`mailto:${ADMIN_EMAIL}`}
                  className="text-primary underline hover:no-underline"
                >
                  {ADMIN_EMAIL}
                </a>
                <br />
                Contact number:{" "}
                {PHONES.map((phone, i) => (
                  <span key={phone.tel}>
                    {i > 0 && ", "}
                    <a
                      href={`tel:${phone.tel}`}
                      className="text-primary underline hover:no-underline"
                    >
                      {phone.display}
                    </a>
                  </span>
                ))}
                <br />
                Working hours: Mon–Sat, 9:00 AM – 5:00 PM (Sunday closed)
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                What happens next
              </h2>
              <ol className="list-decimal list-outside pl-6 space-y-4">
                <li>
                  <h3 className="font-semibold text-lg inline">
                    Send a deletion request
                  </h3>
                  <p className="mt-1">
                    Email or call us using the contact details above. Include
                    your full name, registered email, and phone number so we can
                    locate your account.
                  </p>
                </li>
                <li>
                  <h3 className="font-semibold text-lg inline">
                    Identity verification
                  </h3>
                  <p className="mt-1">
                    Our team may contact you to confirm ownership of the account
                    before proceeding. This helps protect your data from
                    unauthorised deletion requests.
                  </p>
                </li>
                <li>
                  <h3 className="font-semibold text-lg inline">
                    Processing timeline
                  </h3>
                  <p className="mt-1">
                    Account deletion requests are typically processed within 7
                    business days. You will receive a confirmation once your
                    account and associated personal data have been removed.
                  </p>
                </li>
              </ol>
            </section>

            <p>
              <span className="font-semibold">Please note:</span> Account
              deletion is permanent. Once processed, you will lose access to
              your login, and any profile information associated with your
              account will be removed from the platform. For details on how we
              handle personal data, see our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary underline hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <p>
              If you only wish to pause or deactivate your profile, you may
              contact us to discuss alternatives before requesting full account
              deletion.
            </p>

            <p className="text-sm text-muted-foreground pt-2">
              Aiswarya Marriage Bureau
              <br />
              Near Private Bus Stand, Cherthala – 688524, Kerala, India
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteMyAccountPage;
