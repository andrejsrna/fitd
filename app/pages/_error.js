import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const { pathname } = router;
    
    // Ak URL obsahuje /post-name (napr. niečo ako /my-post)
    if (!pathname.startsWith('/clanky') && pathname !== '/404') {
      const newPath = `/clanky${pathname}`;
      router.replace(newPath); // Presmerovanie na novú URL
    }
  }, [router]);

  return (
    <div>
      <h1>404 - Stránka nenájdená</h1>
      <p>Stránka, ktorú hľadáte, neexistuje.</p>
    </div>
  );
}
