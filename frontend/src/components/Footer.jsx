import Link from 'next/link';
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="text-white bg-dark">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="3" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold">QuickHire</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Great platform for the job seeker that is passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">About</h4>
            <ul className="space-y-3">
              {['Companies', 'Pricing', 'Terms', 'Advice', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <Link href="javascript:void(0)" className="text-sm text-gray-400 transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">Resources</h4>
            <ul className="space-y-3">
              {['Help Docs', 'Guide', 'Updates', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link href="javascript:void(0)" className="text-sm text-gray-400 transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-2 text-sm font-semibold tracking-wider text-gray-300 uppercase">Get job notifications</h4>
            <p className="mb-4 text-sm text-gray-400">The latest job news, articles, sent to your inbox weekly.</p>
            <div className="flex flex-col gap-2 xl:flex-row md:items-start ">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 border-t border-white/10 md:flex-row">
          <p className="text-sm text-gray-500">
            2021 © QuickHire. All rights reserved.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
              <a key={social} href="javascript:void(0)" className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-primary">
                <Icon icon={`entypo-social:${social}`} width="20" height="20" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
