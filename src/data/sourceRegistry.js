export const SOURCE_REGISTRY = [
  { id:'openai-news', name:'OpenAI News', url:'https://openai.com/news/', kind:'primary', priority:'P1', adapter:'html', checkMinutes:10, topics:['AI','models','enterprise','infrastructure'] },
  { id:'anthropic-news', name:'Anthropic Newsroom', url:'https://www.anthropic.com/news', kind:'primary', priority:'P1', adapter:'html', checkMinutes:10, topics:['AI','models','agents','enterprise'] },
  { id:'deepmind-blog', name:'Google DeepMind', url:'https://deepmind.google/blog/', kind:'primary', priority:'P1', adapter:'html', checkMinutes:15, topics:['AI','research','models','science'] },
  { id:'nvidia-news', name:'NVIDIA Newsroom', url:'https://nvidianews.nvidia.com/releases.xml', kind:'primary', priority:'P1', adapter:'rss', checkMinutes:10, topics:['GPU','AI infrastructure','networking','data center'] },
  { id:'twse-mops', name:'TWSE / MOPS', url:'https://mops.twse.com.tw/mops/web/index', kind:'market', priority:'P1', adapter:'html', checkMinutes:10, countries:['Taiwan'], topics:['material information','listed companies'] },
  { id:'moda', name:'Taiwan MODA', url:'https://moda.gov.tw/en/', kind:'government', priority:'P1', adapter:'html', checkMinutes:30, countries:['Taiwan'], topics:['AI policy','GPU','digital infrastructure'] },
  { id:'moea', name:'Taiwan MOEA', url:'https://www.moea.gov.tw/Mns/english/home/English.aspx', kind:'government', priority:'P1', adapter:'html', checkMinutes:30, countries:['Taiwan'], topics:['industry','energy','investment'] },
  { id:'ndc', name:'Taiwan NDC', url:'https://www.ndc.gov.tw/en/', kind:'government', priority:'P1', adapter:'html', checkMinutes:1440, countries:['Taiwan'], topics:['economy','PMI','business indicators','policy'] },
  { id:'reuters', name:'Reuters', url:'https://www.reuters.com/', kind:'media', priority:'P1', adapter:'manual', checkMinutes:15, topics:['business','AI','markets'] },
  { id:'bloomberg', name:'Bloomberg', url:'https://www.bloomberg.com/', kind:'media', priority:'P1', adapter:'manual', checkMinutes:15, topics:['business','AI','markets'] },
  { id:'ft', name:'Financial Times', url:'https://www.ft.com/', kind:'media', priority:'P1', adapter:'manual', checkMinutes:20, topics:['business','AI','markets'] },
  { id:'nikkei', name:'Nikkei Asia', url:'https://asia.nikkei.com/', kind:'media', priority:'P1', adapter:'manual', checkMinutes:20, topics:['Asia','business','technology'] },
  { id:'wsj', name:'Wall Street Journal', url:'https://www.wsj.com/', kind:'media', priority:'P2', adapter:'manual', checkMinutes:30, topics:['business','markets'] },
  { id:'cnbc', name:'CNBC', url:'https://www.cnbc.com/', kind:'media', priority:'P2', adapter:'manual', checkMinutes:30, topics:['business','markets','technology'] },
  { id:'wechat-curated', name:'WeChat Curated Intelligence', url:'wechat://curated', kind:'curated', priority:'P1', adapter:'manual', checkMinutes:15, topics:['AI leader clips','Chinese summaries'], notes:'Discovery/curation only; verify important claims against original/primary sources.' }
];
export const AI_LEADERS = ['Jensen Huang','Sam Altman','Dario Amodei','Demis Hassabis','Elon Musk','Sundar Pichai','Satya Nadella','Lisa Su','Mark Zuckerberg','Andy Jassy'];
export const TAIWAN_COMPANIES = ['TSMC','MediaTek','ASE','UMC','Foxconn','Quanta','Wistron','Wiwynn','Inventec','Delta','Accton'];
export const COUNTRY_DEEP_DIVE = ['Taiwan','Korea','Japan','Singapore'];
export const DEEP_DIVE_DIMENSIONS = ['GPU compute','AI data-center capacity','Sovereign AI','Cloud infrastructure','Near / middle-tier cloud','GPU utilization / sharing','Networking','Power & cooling','Enterprise AI adoption','Government investment / policy','Taiwan opportunity gap'];
