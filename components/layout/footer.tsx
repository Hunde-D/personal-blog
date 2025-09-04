export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className=" w-full mx-auto px-6 py-5 flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground text-sm sm:text-base">
          ✨ Built with <span className="font-medium">curiosity</span>,{" "}
          <span className="font-medium">consistency</span>, and a whole lot of ❤️
          + ☕
        </p>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hunde Desalegn — Keep learning, keep
          building 🚀
        </p>

        <div className="flex gap-4 text-muted-foreground text-lg">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            🌐
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            🐦
          </a>
          <a
            href="mailto:your@email.com"
            className="hover:text-foreground transition-colors"
          >
            ✉️
          </a>
        </div>
      </div>
    </footer>
  );
}
