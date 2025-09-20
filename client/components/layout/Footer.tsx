export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-2 text-sm font-semibold">EduMind</div>
          <p className="text-sm text-muted-foreground">
            Digital mental health and psychological support for students in higher education.
          </p>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Support</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><a className="hover:underline" href="/#resources">Resources</a></li>
            <li><a className="hover:underline" href="/#self-check">Self‑assessment</a></li>
            <li><a className="hover:underline" href="#" onClick={(e)=>e.preventDefault()}>Peer Forum (coming soon)</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Institution</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><a className="hover:underline" href="/#about">About</a></li>
            <li><a className="hover:underline" href="#" onClick={(e)=>e.preventDefault()}>Admin dashboard (coming soon)</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Disclaimer</div>
          <p className="text-xs text-muted-foreground">
            This platform does not provide medical diagnosis. If you are in immediate danger, call your local emergency number.
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduMind — Built for campuses.
      </div>
    </footer>
  );
}
