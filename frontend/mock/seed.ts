import { Claim, Verdict } from '@/lib/types';

const exampleVerdict: Verdict = {
  score: 72,
  label: 'Mostly True',
  justification:
    'Multiple reputable sources corroborate the key facts, though some details remain uncertain.',
  sources: [
    {
      id: 's1',
      domain: 'example.com',
      credibility: 78,
      snippet: 'Quoted snippet from the source...',
      url: 'https://example.com/article',
      isOpenSource: true
    },
    {
      id: 's2',
      domain: 'news.ycombinator.com',
      credibility: 65,
      snippet: 'Discussion thread indicating mixed opinions with some citations.',
      url: 'https://news.ycombinator.com/'
    }
  ]
};

export function seedConversation(page = 0, count = 4, older = false): Claim[] {
  const baseTime = new Date().getTime() - page * 3600_000;
  const items: Claim[] = [];
  for (let i = 0; i < count; i++) {
    const id = `${older ? 'old' : 'seed'}-${page}-${i}`;
    const user: Claim = {
      claim_id: `${id}-u`,
      text: `Is statement #${page}-${i} true?`,
      timestamp: new Date(baseTime - i * 60_000).toISOString(),
      status: 'done',
      role: 'user'
    };
    const system: Claim = {
      claim_id: `${id}-s`,
      text: '',
      timestamp: new Date(baseTime - i * 60_000 + 5_000).toISOString(),
      status: 'done',
      role: 'system',
      verdict: exampleVerdict
    };
    items.push(user, system);
  }
  return items;
}

export const exampleVerdictResponse = {
  claim_id: 'c123',
  status: 'done' as const,
  verdict: exampleVerdict,
  timestamp: '2025-09-01T12:00:00Z'
};


