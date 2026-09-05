// TBAR Interview Intelligence Registry
// Purpose: long-form interviews/speeches are first-class intelligence, not ordinary news.
// Keep the core 10 AI leaders stable. Analysts/interpreters are a separate discovery layer.

export const INTERVIEW_LEADERS = [
  'Jensen Huang','Sam Altman','Dario Amodei','Demis Hassabis','Elon Musk',
  'Sundar Pichai','Satya Nadella','Lisa Su','Mark Zuckerberg','Andy Jassy'
];

// High-value people who interpret, translate, synthesize or contextualize primary interviews.
// They are not treated as primary truth sources; they are a privileged discovery/interpretation layer.
export const TOP_INTERPRETERS = [
  { name:'Dylan Patel', affiliation:'SemiAnalysis', focus:['AI compute','semiconductors','AI infrastructure','lab economics'] },
  { name:'Dwarkesh Patel', affiliation:'Dwarkesh Podcast', focus:['AI leaders','long-form interviews','AI economics','AGI'] },
  { name:'WeChat curated interpreter — pending identity', affiliation:'WeChat / 视频号', focus:['Chinese translation','AI leader interviews','AI economics','investment interpretation'], status:'identify-and-track' }
];

export const INTERVIEW_PIPELINE = [
  'PRIMARY_INTERVIEW',
  'CURATED_INTERPRETER',
  'TBAR_EXECUTIVE_INTELLIGENCE'
];

export const CURATED_INTERPRETER_REQUIREMENTS = {
  capture:[
    'interpreterName','channelOrAccount','originalInterview','originalSpeaker','translatedSummary',
    'interpreterView','keyNumbers','keyFrameworks','sourceUrl','originalSourceUrl','publishedAt'
  ],
  principles:[
    'A strong Chinese interpreter/translator can be a P1 discovery source even when not a primary source.',
    'Preserve what came from the original speaker versus what was added by the interpreter.',
    'Use the interpreter for compression, framing and insight; use the primary interview for factual verification.',
    'Track recurring high-quality interpreters as named watchlist sources rather than treating each post as an isolated clip.',
    'Prioritize interpreters who consistently surface business models, unit economics, infrastructure constraints, competitive structure and investable implications.'
  ]
};

export const INTERVIEW_REQUIREMENTS = {
  outputs:[
    'executiveSummary','keyTheses','keyNumbers','memorableQuotes','whyItMatters',
    'taiwanLens','hpeLens','investmentLens','originalSource','transcriptSource','verification',
    'interpreterSummary','interpreterView'
  ],
  rules:[
    'Attribute every thesis to the actual speaker; do not turn an analyst interpretation into a CEO quote.',
    'Prefer the original interview/transcript for factual verification, while retaining high-quality interpreter framing.',
    'Treat WeChat/short clips as discovery and interpretation signals; search for the primary interview using title, speaker and distinctive claims.',
    'Verify material numbers against primary sources or clearly label them as analyst/interpreter estimates.',
    'Preserve timestamps for high-value claims so the user can jump back to the source.',
    'Do not fill the feed with every interview; publish only material deltas or unusually high-value frameworks.'
  ]
};
