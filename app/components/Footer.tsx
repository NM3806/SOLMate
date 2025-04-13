export default function Footer() {
    return (
      <footer className="mt-12 mb-6 border-t border-purple-300 pt-6 text-center text-sm text-muted-foreground">
        <p className="mt-2 text-purple-600">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/NM3806/SOLMate"
            className="hover:underline text-foreground/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            SOLMate
          </a>{" "}
          • Open Source & On-Chain
        </p>
  
        <div className="mt-4 flex justify-center gap-6 text-muted-foreground">
          <a
            href="https://github.com/NM3806"
            className="hover:text-purple-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/naitik-madarwal-nm3806"
            className="hover:text-purple-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="mailto:naitikmadarwal3806@gmail.com"
            className="hover:text-purple-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </footer>
    );
  }
  