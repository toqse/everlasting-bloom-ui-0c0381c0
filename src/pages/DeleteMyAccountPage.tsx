"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { deleteAccount } from "@/lib/settingsApi";
import { getDisplayErrorMessage } from "@/lib/apiErrors";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ADMIN_EMAIL = "aiswarya@aiswaryamatrimonials.com";
const PHONES = [
  { display: "+91 79072 40062", tel: "+917907240062" },
  { display: "+91 62828 57276", tel: "+916282857276" },
] as const;

const DeleteMyAccountPage = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canConfirmDelete = deleteConfirmText.trim().toUpperCase() === "DELETE";

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) {
      setDeleteConfirmText("");
      setDeleteError(null);
      setDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!canConfirmDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      logout();
      router.push("/");
    } catch (err: unknown) {
      setDeleteError(getDisplayErrorMessage(err));
      setDeleting(false);
    }
  };

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
            {isLoggedIn ? (
              <>
                <p>
                  You are signed in. You can delete your Aiswarya Matrimony
                  account yourself below. This deactivates your account,
                  removes your profile from search, and signs you out
                  immediately.
                </p>

                <section className="space-y-4 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-700">
                    Delete account now
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Account deletion cannot be undone from the app. You will
                    lose access to your login, matches, and messages.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 gap-1.5"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete my account
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    You can also delete your account from{" "}
                    <Link
                      href="/dashboard/settings"
                      className="text-primary underline hover:no-underline"
                    >
                      Settings
                    </Link>
                    .
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Need help instead?
                  </h2>
                  <p>
                    If you prefer our team to handle deletion, email{" "}
                    <a
                      href={`mailto:${ADMIN_EMAIL}`}
                      className="text-primary underline hover:no-underline"
                    >
                      {ADMIN_EMAIL}
                    </a>{" "}
                    or call{" "}
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
                    .
                  </p>
                </section>
              </>
            ) : (
              <>
                <p>
                  If you no longer wish to use Aiswarya Matrimony, you can
                  delete your account. Sign in to delete it yourself from this
                  page or from Settings, or contact our team using the details
                  below.
                </p>

                <section className="space-y-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Delete it yourself
                  </h2>
                  <p>
                    Sign in with your registered account, then return here or
                    open Dashboard → Settings to delete your account instantly.
                  </p>
                  <Button
                    type="button"
                    className="rounded-full bg-primary text-primary-foreground"
                    asChild
                  >
                    <Link href="/auth">Sign in to delete account</Link>
                  </Button>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Contact support to delete your account
                  </h2>
                  <p>
                    To request deletion without signing in, email or call us
                    with your{" "}
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
                        Email or call us using the contact details above.
                        Include your full name, registered email, and phone
                        number so we can locate your account.
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold text-lg inline">
                        Identity verification
                      </h3>
                      <p className="mt-1">
                        Our team may contact you to confirm ownership of the
                        account before proceeding. This helps protect your data
                        from unauthorised deletion requests.
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold text-lg inline">
                        Processing timeline
                      </h3>
                      <p className="mt-1">
                        Account deletion requests are typically processed within
                        7 business days. You will receive a confirmation once
                        your account and associated personal data have been
                        removed.
                      </p>
                    </li>
                  </ol>
                </section>
              </>
            )}

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
              If you only wish to pause or deactivate your profile, you can set
              profile visibility to Hidden in Settings, or contact us to discuss
              alternatives before requesting full account deletion.
            </p>

            <p className="text-sm text-muted-foreground pt-2">
              Aiswarya Marriage Bureau
              <br />
              Near Private Bus Stand, Cherthala – 688524, Kerala, India
            </p>
          </div>
        </div>
      </main>

      <AlertDialog open={deleteOpen} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent className="rounded-2xl sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This deactivates your account and removes your profile from
              search. Type{" "}
              <span className="font-semibold text-foreground">DELETE</span> to
              confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            autoComplete="off"
            disabled={deleting}
            className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm bg-white disabled:opacity-50"
          />
          {deleteError && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={!canConfirmDelete || deleting}
              onClick={() => void handleDeleteAccount()}
              className="rounded-md gap-1.5"
            >
              {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteMyAccountPage;
