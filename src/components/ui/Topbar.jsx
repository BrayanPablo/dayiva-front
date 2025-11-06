// ThemeSwitcher eliminado del header (se mantiene en el sidebar)

export default function Topbar() {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-600 text-primary-content">
      <div className="px-2 md:px-4 py-2 flex items-center justify-between gap-2">
        {/* Left */}
        <div className="flex items-center gap-2">
          <label htmlFor="left-drawer" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </label>
        </div>

        {/* Center removido para no ocupar espacio */}
        <div className="flex-1"></div>

        {/* Right (sin logo) */}
        <div className="flex items-center gap-2"></div>
      </div>
    </div>
  );
}


