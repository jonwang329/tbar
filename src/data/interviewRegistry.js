// TBAR Interview Intelligence Registry
// Long-form interviews and speeches are first-class intelligence, not decorative watchlist names.

export const INTERVIEW_LEADERS = [
  { name:'Jensen Huang', company:'NVIDIA', role:'Founder & CEO', priority:'P1' },
  { name:'Sam Altman', company:'OpenAI', role:'CEO', priority:'P1' },
  { name:'Dario Amodei', company:'Anthropic', role:'Co-founder & CEO', priority:'P1' },
  { name:'Demis Hassabis', company:'Google DeepMind', role:'Co-founder & CEO', priority:'P1' },
  { name:'Sundar Pichai', company:'Google / Alphabet', role:'CEO', priority:'P1' },
  { name:'Satya Nadella', company:'Microsoft', role:'Chairman & CEO', priority:'P1' },
  { name:'Matt Garman', company:'AWS', role:'CEO', priority:'P1' },
  { name:'Lisa Su', company:'AMD', role:'Chair & CEO', priority:'P1' },
  { name:'Elon Musk', company:'xAI / Tesla / SpaceX', role:'Founder / CEO', priority:'P1' },
  { name:'Mark Zuckerberg', company:'Meta', role:'Founder & CEO', priority:'P1' }
];

export const SECONDARY_EXECUTIVE_WATCH = [
  { name:'Andy Jassy', company:'Amazon', role:'President & CEO', reason:'Amazon/AWS capital allocation and AI strategy' }
];

export const TOP_INTERPRETERS = [
  { name:'Dylan Patel', affiliation:'SemiAnalysis', focus:['AI compute','semiconductors','AI infrastructure','lab economics'] },
  { name:'Dwarkesh Patel', affiliation:'Dwarkesh Podcast', focus:['AI leaders','long-form interviews','AI economics','AGI'] },
  { name:'AI 智能体研习社', affiliation:'WeChat / 视频号', priority:'P1', focus:['Chinese interpretation','AI leader interviews','AI economics','compute economics','investment interpretation'], status:'track-recurring-posts' }
];

export const INTERVIEW_PIPELINE = [
  'DISCOVER_NEW_LONG_FORM_CONTENT',
  'IDENTIFY_PRIMARY_SPEAKER_AND_SOURCE',
  'READ_OR_EXTRACT_TRANSCRIPT',
  'SEPARATE_PRIMARY_VIEW_FROM_INTERPRETER_VIEW',
  'EXTRACT_EXECUTIVE_INTELLIGENCE',
  'VERIFY_MATERIAL_NUMBERS',
  'PUBLISH_ONLY_IF_HIGH_VALUE'
];

export const LEADER_RADAR_POLICY = {
  purpose:'Surface what important AI leaders are actually saying now, not merely list their names.',
  discoveryTargets:['interview','podcast','keynote','fireside chat','earnings discussion','conference talk','long-form Q&A'],
  minimumUsefulOutput:[
    'speaker','company','publishedAt','originalSource','executiveSummary','keyTheses','keyNumbers',
    'whyItMatters','taiwanLens','hpeLens','investmentLens','verification'
  ],
  displayRules:[
    'Never render a leader name as a substitute for intelligence.',
    'If there is no meaningful new interview or speech, show no card for that leader.',
    'Prefer 1-3 high-value leader items over a complete ten-person checklist.',
    'A new interview should be promoted when it reveals strategy, economics, infrastructure constraints, model direction, enterprise adoption, capital allocation or competitive structure.',
    'Store source and publication date so old interviews are not mistaken for new signals.'
  ]
};

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
