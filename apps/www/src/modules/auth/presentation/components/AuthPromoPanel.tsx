export function AuthPromoPanel() {
  return (
    <div className="hidden lg:flex lg:w-[55%] bg-promo-bg relative overflow-hidden items-center justify-center p-12 min-h-screen">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-lg text-white">
        {/* Dashboard preview card */}
        <div className="relative mb-12 transform hover:scale-[1.02] transition-transform duration-500 ease-out">
          {/* Revenue badge */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center justify-center animate-pulse">
            <div className="text-center">
              <p className="text-xs text-white/70 uppercase tracking-wider">Receita</p>
              <p className="text-xl font-bold mt-1">+R$42k</p>
            </div>
          </div>

          {/* Main card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="h-2 w-24 bg-white/40 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-white/20 rounded"></div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-xs font-medium">
                +12.5%
              </span>
            </div>

            {/* Chart bars */}
            <div className="flex items-end justify-between h-32 gap-3">
              <div className="w-full bg-white/10 rounded-t-lg h-[40%] hover:bg-white/20 transition-colors"></div>
              <div className="w-full bg-white/10 rounded-t-lg h-[70%] hover:bg-white/20 transition-colors"></div>
              <div className="w-full bg-white/30 rounded-t-lg h-[55%] hover:bg-white/40 transition-colors"></div>
              <div className="w-full bg-white/10 rounded-t-lg h-[85%] hover:bg-white/20 transition-colors"></div>
              <div className="w-full bg-white/10 rounded-t-lg h-[60%] hover:bg-white/20 transition-colors"></div>
            </div>
          </div>

          {/* Notification card */}
          <div className="absolute -bottom-5 -left-5 bg-promo-surface/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl flex items-center gap-3 w-56">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-semibold">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold">Nova Inscrição</p>
              <p className="text-xs text-white/60">há 2 minutos</p>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Construa, gerencie e escale eventos corporativos em um só lugar.
        </h2>
        <p className="text-lg text-white/80 leading-relaxed">
          Otimize seu fluxo de trabalho com nossa plataforma tudo-em-um projetada para equipes de
          eventos modernas.
        </p>

        {/* Pagination indicators */}
        <div className="mt-8 flex gap-2">
          <div className="h-1.5 w-8 bg-white rounded-full"></div>
          <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
          <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
