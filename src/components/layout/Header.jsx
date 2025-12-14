function Header() {
    return (
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-300 shadow-lg shadow-cyan-500/25" />
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Food Recommendations</p>
                    <h1 className="text-xl font-bold gradient-text leading-none">Clean Fuel Lab</h1>
                </div>
            </div>
            <div className="pill">Smart macros • Personalized</div>
        </header>
    );
}

export default Header;
