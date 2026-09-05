// TBAR Interview Intelligence Registry
// Purpose: long-form interviews/speeches are first-class intelligence, not ordinary news.
// Keep the core 10 AI leaders stable. Analysts/interpreters are a separate discovery layer.

export const INTERVIEW_LEADERS = [
  'Jensen Huang','Sam Altman','Dario Amodei','Demis Hassabis','Elon Musk',
  'Sundar Pichai','Satya Nadella','Lisa Su','Mark Zuckerberg','Andy Jassy'
];

export const TOP_INTERPRETERS = [
  { name:'Dylan Patel', affiliation:'SemiAnalysis', focus:['AI compute','semiconductors','AI infrastructure','lab economics'] },
  { name:'Dwarkesh Patel', affiliation:'Dwarkesh Podcast', focus:['AI leaders','long-form interviews','AI economics','AGI'] }
];

export const INTERVIEW_REQUIREMENTS = {
  outputs:[
    'executiveSummary','keyTheses','keyNumbers','memorableQuotes','whyItMatters',
    'taiwanLens','hpeLens','investmentLens','originalSource','transcriptSource','verification'
  ],
  rules:[
    'Attribute every thesis to the actual speaker; do not turn an analyst interpretation into a CEO quote.',
    'Prefer the original interview/transcript over a clipped or translated repost.',
    'Treat WeChat/short clips as discovery signals; search for the primary interview using title, speaker and distinctive claims.',
    'Verify material numbers against primary sources or clearly label them as analyst estimates.',
    'Preserve timestamps for high-value claims so the user can jump back to the source.',
    'Do not fill the feed with every interview; publish only material deltas or unusually high-value frameworks.'
  ]
};
