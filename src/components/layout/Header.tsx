function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-4">
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-gray-900"
        >
          Postframe
        </a>

        {/* <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/templates"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            Templates
          </a>

          <a
            href="/about"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            About
          </a>
        </nav> */}
      </div>
    </header>
  );
}

export default Header;
