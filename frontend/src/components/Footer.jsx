export default function Footer() {
  const footerLinks = [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms", href: "#terms" }
  ]

  return (
    // Simple footer with minimal styling
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <img src="/logo.png" alt="MayurJobs" className="h-6 w-6 rounded-md object-contain shadow-xs border border-slate-100" />
            <span>© 2026 <span className="font-semibold text-slate-900">Mayur Job Portal</span>. All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
