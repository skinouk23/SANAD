import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export function AssistantTopBarButton() {
  return (
    <Link
      aria-label="Open Sanad Assistant"
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30 transition-colors hover:from-cyan-400 hover:to-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 dark:border-cyan-300/30"
      title="Open Sanad Assistant"
      to="/assistant"
    >
      <Bot className="h-6 w-6" />
    </Link>
  );
}
