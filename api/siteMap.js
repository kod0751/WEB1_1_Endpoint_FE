export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  // Bot 확인
  const isBot = /bot|crawl|spider|mediapartners/i.test(userAgent);

  if (!isBot) {
    res.status(200).send('Sitemap is only for bots.');
    return;
  }

  const routes = [
    { loc: 'https://quizy-fe.vercel.app/', priority: 1.0 },
    { loc: 'https://quizy-fe.vercel.app/main', priority: 0.9 },
    { loc: 'https://quizy-fe.vercel.app/search', priority: 0.8 },
    { loc: 'https://quizy-fe.vercel.app/game', priority: 0.8 },
    { loc: 'https://quizy-fe.vercel.app/create', priority: 0.7 },
    { loc: 'https://quizy-fe.vercel.app/waiting', priority: 0.7 },
    { loc: 'https://quizy-fe.vercel.app/play', priority: 0.8 },
    { loc: 'https://quizy-fe.vercel.app/result', priority: 0.6 },
    { loc: 'https://quizy-fe.vercel.app/entry', priority: 0.6 },
    { loc: 'https://quizy-fe.vercel.app/profile', priority: 0.9 },
    { loc: 'https://quizy-fe.vercel.app/profile/reviewNote', priority: 0.8 },
    { loc: 'https://quizy-fe.vercel.app/profile/quizManagement', priority: 0.8 },
    { loc: 'https://quizy-fe.vercel.app/quiz/ab', priority: 0.7 },
    { loc: 'https://quizy-fe.vercel.app/quiz/ox', priority: 0.7 },
    { loc: 'https://quizy-fe.vercel.app/quiz/multiple', priority: 0.7 },
  ];

  // sitemap.xml 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
        <loc>${route.loc}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>${route.priority}</priority>
    </url>
  `,
    )
    .join('')}
</urlset>`;

  // 응답 설정
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
