import Link from 'next/link'

export const metadata = {
  title: 'Terms and Conditions - Sprite Sheet Generator',
  description: 'Terms and Conditions and cookie notice for Sprite Sheet Generator',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-rich-black">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-mimi-pink-500 mb-6">Terms and Conditions</h1>
        <p className="text-citron-600 mb-2">Last updated: September 1, 2025</p>

        <section className="space-y-4 text-citron-600">
          <p>
            Welcome to Sprite Sheet Generator. By accessing or using this website and services, you agree to be bound by these
            Terms and Conditions. If you do not agree with these terms, please do not use the site.
          </p>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Cookie Notice</h2>
          <p>
            We use cookies and similar technologies to help us make the site better. Cookies enable core functionality (such as
            authentication), remember your preferences, and help us analyze usage so we can improve performance and features.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="text-mimi-pink-500">Essential cookies:</span> required for sign-in, session management, and security.</li>
            <li><span className="text-mimi-pink-500">Preference cookies:</span> store settings like selected styles and UI preferences.</li>
            <li><span className="text-mimi-pink-500">Analytics cookies:</span> help us understand how the site is used so we can improve it.</li>
          </ul>
          <p>
            By using this site, you consent to our use of cookies. You can control cookies through your browser settings, but
            disabling some cookies may impact core functionality.
          </p>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Use of the Service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You agree to use the site in compliance with applicable laws and these Terms.</li>
            <li>You will not attempt to interfere with the platform’s security or integrity.</li>
            <li>You are responsible for any content you submit, including prompts and uploaded images.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Accounts and Subscriptions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>Usage limits and features depend on your selected plan.</li>
            <li>We may change plan features or pricing upon reasonable notice.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Intellectual Property</h2>
          <p>
            The site, its content, and underlying technology are owned by us or our licensors. Subject to your compliance with
            these Terms, you may use the output you generate for your own projects, subject to any applicable third‑party model
            or asset licenses.
          </p>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, the service is provided “as is” without warranties of any kind. We are not
            liable for any indirect, incidental, or consequential damages arising from your use of the site.
          </p>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the site after updates constitutes acceptance of the
            revised Terms.
          </p>

          <h2 className="text-2xl font-semibold text-mimi-pink-500 mt-8">Contact</h2>
          <p>
            If you have questions about these Terms or our use of cookies, please contact us via the feedback link in the footer.
          </p>
        </section>

        <div className="mt-10">
          <Link href="/" className="text-violet underline">Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
