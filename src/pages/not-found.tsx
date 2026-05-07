import { Link } from "wouter";
import { Home, Frown } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="font-display text-[12rem] leading-none text-primary/20 select-none">404</div>
        <Frown className="w-16 h-16 text-primary mx-auto mb-4 -mt-4" />
        <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Looks like this episode doesn't exist. Let's get you back to safety.
        </p>
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
