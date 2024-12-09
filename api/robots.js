export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  // Bot 확인
  const isBot = /bot|crawl|spider|mediapartners/i.test(userAgent);

  if (!isBot) {
    res.status(200).send('Robots.txt is only for bots.');
    return;
  }

  // robots.txt 생성
  const robots = `User-agent: *
Disallow: /oauth/kakao/callback
Disallow: /oauth/google/callback
Disallow: /interest

Sitemap: https://quizy-fe.vercel.app/api/sitemap`;

  // 응답 설정
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robots);
}
