"use client";


const clauses = [
  "M/s Aiswarya Vivaha Bureau is furnishing the following details for your information and further clarification- (proposals, and other concerned details is also added to this information)",
  "As per the rules and regulations of Aiswarya Vivaha Bureau, if you remit to the fees properly at the time of entrance you can select or choose the information from our office ( Downloading)",
  "Genuine information can be collecting from our office and if you these use this information on any malpractice or misuse, defiantly it is illegal and immoral so such a situation you will face disciplinary action or legal way of steps from the institution.",
  "If you select any proposal according to your taste and preference no change will not be possible",
  "At the time of your submission of information, if any error or mistake or confusion (Groom / Bride) the full responsibility is going to either Bride party or Groom Party.",
  "Our reputed institution is operating more than 39years since then perfect operation and perfect attitude towards the parties the meaning is that our service is sincere, responsible sofar.",
  "M/s Aiswrya Vivaha Bureau is operating especially matrimonial service wants as the amount 10000/- from Bride, 15000/- from Groom as a part of service charge. If you are selecting the process, our staff's full support to that attempt. The most important specialty is that not enjoying additional amount or wrong way reward or other related fund collection. It is an outstanding merit of our institution than that of other institution if any.",
  "Anycompliant or false information from our institution if happen, surely we will take necessary steps for avoiding such mistake or false information, suitable remedy will be taken. You can contact customer cell number.",
  "If any mistake or illegal activities from the part of our institution selected to marriage proposals legal proceeding will be taken in Cherthala Legal Jurisdiction",
  "We have number of branches of in Kerala you can select our Website and collect information, you can send your proposal as per any branch of our institution full support and follow up is over basic obligation.",
];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl w-full">
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/images/WhatsApp_Image_2026-03-04_at_10.28.26_AM-removebg-preview.png"
              alt="Aiswarya Vivaha Bureau - 39 Years of Trust & Tradition"
              className="mx-auto max-h-32 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black text-center uppercase tracking-tight mb-2">
            Terms and Conditions
          </h1>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-10" />

          {/* Clauses */}
          <ol className="terms-list space-y-5 list-decimal list-outside text-black text-base sm:text-lg leading-relaxed w-full pl-8 sm:pl-10">
            {clauses.map((text, i) => (
              <li key={i} className="w-full">
                <span>{text}</span>
              </li>
            ))}
          </ol>

          {/* Footer line */}
          <p className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t border-primary/10">
          Aiswarya Vivaha Bureau | 39 Years of Trust & Tradition
          </p>
        </div>
      </main>

    </div>
  );
};

export default TermsPage;
