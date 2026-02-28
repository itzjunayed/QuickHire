import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="3" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-xl">QuickHire</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Great platform for the job seeker that is passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-3">
              {['Companies', 'Pricing', 'Terms', 'Advice', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Help Docs', 'Guide', 'Updates', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-2">Get job notifications</h4>
            <p className="text-gray-400 text-sm mb-4">The latest job news, articles, sent to your inbox weekly.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            2021 © QuickHire. All rights reserved.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
              <a key={social} href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-xs font-bold text-gray-400 capitalize">{social[0].toUpperCase()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
