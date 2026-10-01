import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string; // e.g., '/', '/albums', '/album', '/memory', '/timeline', '/favorites', '/settings', '/create'
  paramId?: string; // e.g. 'summer-26'
  query?: Record<string, string>;
}

export function parseHash(hash: string): RouteState {
  const clean = hash.replace(/^#\/?/, '');
  const [routePart, queryPart] = clean.split('?');
  let activeSegments = (routePart || '').split('/').filter(Boolean);
  if (activeSegments[0] === 'A-memories-') {
    activeSegments = activeSegments.slice(1);
  }

  const query: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  if (activeSegments.length === 0) {
    return { path: '/', query };
  }

  if (activeSegments[0] === 'album' && activeSegments[1]) {
    return { path: '/album', paramId: decodeURIComponent(activeSegments[1]), query };
  }

  if (activeSegments[0] === 'memory' && activeSegments[1]) {
    return { path: '/memory', paramId: decodeURIComponent(activeSegments[1]), query };
  }

  return { path: `/${activeSegments[0]}`, query };
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash);
    }
    return { path: '/' };
  });

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // In case no hash is present at initial load, normalize to #/
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    const normalized = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : '/' + to}`;
    if (window.location.hash === normalized) {
      setRoute(parseHash(normalized));
      window.scrollTo(0, 0);
    } else {
      window.location.hash = normalized;
    }
  }, []);

  return { route, navigate };
}
