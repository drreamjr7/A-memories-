import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LUMORA React ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-neutral-200 flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <span className="text-xl">⚠️</span>
            </div>
            
            <h2 className="text-lg font-bold text-white tracking-wide">
              Application failed to render
            </h2>
            
            <p className="text-xs text-neutral-400 leading-relaxed font-mono bg-neutral-950/60 p-3 rounded-xl border border-white/5 break-words">
              {this.state.errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Reload Application
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Storage & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
