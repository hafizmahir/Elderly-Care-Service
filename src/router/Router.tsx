import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  hash: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentHash(window.location.hash || '');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    // Separate hash part
    let target = to;
    let targetHash = '';
    if (target.includes('#')) {
      const hashSplit = target.split('#');
      target = hashSplit[0] || '/';
      targetHash = hashSplit[1] ? `#${hashSplit[1]}` : '';
    }

    // Separate search query
    const [pathPart, searchPart] = target.split('?');
    const cleanPath = pathPart || '/';

    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }

    setCurrentPath(cleanPath);
    setCurrentHash(targetHash);
    setSearchParams(new URLSearchParams(searchPart || ''));

    if (targetHash) {
      const elId = targetHash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(elId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to extract path params based on common patterns
  const extractParams = (path: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const serviceMatch = path.match(/^\/service\/([^/?#]+)/);
    if (serviceMatch) {
      params.service_id = serviceMatch[1];
    }
    const bookingMatch = path.match(/^\/booking\/([^/?#]+)/);
    if (bookingMatch) {
      params.service_id = bookingMatch[1];
    }
    return params;
  };

  return (
    <RouterContext.Provider
      value={{
        path: currentPath,
        hash: currentHash,
        navigate,
        params: extractParams(currentPath),
        searchParams
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}> = ({ href, className, children, onClick, title }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  );
};
