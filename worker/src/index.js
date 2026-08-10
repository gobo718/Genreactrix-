/* Genreactrix AI Worker v0.9.6.2 — component-scoped structured output with bounded recovery. */
const API_VERSION='0.9.6.2';
const BUILD_ID='component-json-schema-r1';
const cors={
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET, POST, OPTIONS',
  'access-control-allow-headers':'content-type, x-analysis-key'
};
const json=(body,init={})=>new Response(JSON.stringify(body),{
  ...init,
  headers:{...cors,'content-type':'application/json; charset=utf-8',...(init.headers||{})}
});
const DEFAULT_MODEL='@cf/meta/llama-3.2-11b-vision-instruct';
const COMPONENT_IDS=['reactions','themes','description','emotion','reactionReasons','genreReasons'];
const REACTION_NAMES=['Beautiful','Adorable','Tragic','Funny','Intense','Weird','Ticket','Dreamy','Zazzly','Disgusting','Scary','Smart','Celebration','Angry'];
const PROMPT_VERSION='genreactrix-v1';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

const strip=text=>String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
const parse=value=>{
  if(value&&typeof value==='object')return value;
  const clean=strip(value);
  try{return JSON.parse(clean)}catch{}
  const a=clean.indexOf('{'),b=clean.lastIndexOf('}');
  if(a>=0&&b>a){try{return JSON.parse(clean.slice(a,b+1))}catch{}}
  throw new Error('Vision provider returned invalid JSON');
};
const responseValue=p=>{
  if(p&&typeof p==='object'){
    if(Object.prototype.hasOwnProperty.call(p,'response'))return p.response;
    if(p.result&&typeof p.result==='object'&&Object.prototype.hasOwnProperty.call(p.result,'response'))return p.result.response;
    if(Object.prototype.hasOwnProperty.call(p,'output_text'))return p.output_text;
  }
  return p;
};
const fetchBytes=async url=>{
  if(!/^https:\/\//i.test(url)||url.length>2000)throw new Error('imageUrl must be HTTPS');
  const r=await fetch(url,{headers:{accept:'image/*'}});
  if(!r.ok)throw new Error(`Could not retrieve image (${r.status})`);
  const bytes=new Uint8Array(await r.arrayBuffer());
  if(!bytes.length)throw new Error('Image was empty');
  if(bytes.length>6_000_000)throw new Error('Image exceeds 6 MB');
  return Array.from(bytes);
};
const dataUrlBytes=value=>{
  const m=String(value||'').match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if(!m)throw new Error('imageDataUrl must be a base64 image');
  const binary=atob(m[1]);
  if(binary.length>6_000_000)throw new Error('Image exceeds 6 MB');
  return Array.from(binary,c=>c.charCodeAt(0));
};

const scoreSchema={
  type:'object',
  properties:{
    confidence:{type:'number',minimum:0,maximum:100},
    reason:{type:'string'}
  },
  required:['confidence','reason'],
  additionalProperties:false
};
const reactionProperties=Object.fromEntries(REACTION_NAMES.map(name=>[name,scoreSchema]));
const componentSchemas={
  reactions:{
    type:'object',
    properties:{reactions:{type:'object',properties:reactionProperties,required:REACTION_NAMES,additionalProperties:false}},
    required:['reactions'],
    additionalProperties:false
  },
  themes:{
    type:'object',
    properties:{themes:{
      type:'array',minItems:3,maxItems:3,
      items:{
        type:'object',
        properties:{
          theme:{type:'string'},
          confidence:{type:'number',minimum:0,maximum:100},
          evidence:{type:'string'},
          role:{type:'string',enum:['primary','secondary','ambiguous']}
        },
        required:['theme','confidence','evidence','role'],
        additionalProperties:false
      }
    }},
    required:['themes'],
    additionalProperties:false
  },
  description:{
    type:'object',
    properties:{description:{type:'string'}},
    required:['description'],
    additionalProperties:false
  },
  emotion:{
    type:'object',
    properties:{emotion:{
      type:'object',
      properties:{
        dominant:{type:'array',items:{type:'string'}},
        secondary:{type:'array',items:{type:'string'}},
        tone:{type:'string'},
        intensity:{type:'number',minimum:0,maximum:100},
        contrasts:{type:'array',items:{type:'string'}},
        causes:{type:'array',items:{type:'string'}}
      },
      required:['dominant','secondary','tone','intensity','contrasts','causes'],
      additionalProperties:false
    }},
    required:['emotion'],
    additionalProperties:false
  },
  reactionReasons:{
    type:'object',
    properties:{reactionReasons:{type:'object'}},
    required:['reactionReasons'],
    additionalProperties:false
  },
  genreReasons:{
    type:'object',
    properties:{genreReasons:{
      type:'array',
      items:{
        type:'object',
        properties:{theme:{type:'string'},reason:{type:'string'},evidence:{type:'array',items:{type:'string'}}},
        required:['theme','reason','evidence'],
        additionalProperties:false
      }
    }},
    required:['genreReasons'],
    additionalProperties:false
  }
};

const promptFor=component=>{
  const common='You are Genreactrix, a rigorous visual-research analyst. Analyze only visible evidence in the image. Do not infer hidden identity or backstory.';
  const prompts={
    reactions:`${common} Score every listed Genreactrix reaction independently from 0 to 100: ${REACTION_NAMES.join(', ')}. For each, give a concise reason grounded in visible evidence and the viewer-response mechanism. Return all reactions even when confidence is 0.`,
    themes:`${common} Return exactly THREE distinct theme suggestions. Theme labels must be non-empty and unique ignoring capitalization and surrounding whitespace. Rank them strongest to weakest. Give confidence 0-100, concise visible evidence, and role primary, secondary, or ambiguous. Never repeat the same theme under alternate capitalization or trivial wording.`,
    description:`${common} Write a detailed factual description of subjects, objects, actions, setting, composition, style, visible text, and unusual juxtapositions.`,
    emotion:`${common} Describe visible emotional tone using dominant and secondary emotions, overall tone, 0-100 intensity, contrasts, and visible causes.`,
    reactionReasons:`${common} Return an object keyed by relevant Genreactrix reaction name, with a detailed visible-evidence explanation for why a viewer may feel that reaction.`,
    genreReasons:`${common} Return theme reasoning entries with theme, reason, and an array of visible evidence.`
  };
  return prompts[component]||common;
};

function normalizedConfidence(value){
  const n=Number(value);
  if(!Number.isFinite(n))throw new Error('Confidence was not numeric');
  return Math.max(0,Math.min(100,n));
}
function validateComponent(component,value){
  if(component==='reactions'){
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Reaction output was not an object');
    const out={};
    for(const name of REACTION_NAMES){
      const row=value[name];
      if(!row||typeof row!=='object')throw new Error(`Reaction output omitted ${name}`);
      out[name]={confidence:normalizedConfidence(row.confidence),reason:String(row.reason||'').trim()};
      if(!out[name].reason)throw new Error(`Reaction output omitted a reason for ${name}`);
    }
    return out;
  }
  if(component==='themes'){
    if(!Array.isArray(value))throw new Error('Theme output was not an array');
    const normalized=value.map(row=>({
      theme:String(row?.theme||'').trim(),
      confidence:normalizedConfidence(row?.confidence),
      evidence:String(row?.evidence||'').trim(),
      role:['primary','secondary','ambiguous'].includes(row?.role)?row.role:'ambiguous'
    })).filter(row=>row.theme&&row.evidence);
    const seen=new Set(),unique=[];
    for(const row of normalized){
      const key=row.theme.toLocaleLowerCase();
      if(seen.has(key))continue;
      seen.add(key);unique.push(row);
    }
    if(unique.length!==3)throw new Error(`Theme output contained ${unique.length} unique valid selections; exactly 3 required`);
    return unique;
  }
  if(component==='description'){
    const text=String(value||'').trim();
    if(!text)throw new Error('Description output was empty');
    return text;
  }
  if(component==='emotion'){
    if(!value||typeof value!=='object')throw new Error('Emotion output was not an object');
    return value;
  }
  if(component==='reactionReasons'){
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Reaction reasons output was not an object');
    return value;
  }
  if(component==='genreReasons'){
    if(!Array.isArray(value))throw new Error('Genre reasons output was not an array');
    return value;
  }
  throw new Error(`Unsupported component ${component}`);
}

function isTransientProviderError(message){
  return /json mode couldn'?t be met|rate.?limit|temporar|timeout|timed out|overload|capacity|unavailable|internal error|try again/i.test(String(message||''));
}
function isRecoverableOutputError(message){
  return /invalid json|output|omitted|confidence|description|theme/i.test(String(message||''));
}

async function runComponent(env,model,image,component){
  const schema=componentSchemas[component];
  if(!schema)throw new Error(`No structured schema for ${component}`);
  let lastError=null;
  for(let attempt=1;attempt<=3;attempt++){
    const schemaMode=attempt<3;
    const correction=attempt===1?'':` Previous attempt was unusable. Follow the requested structure exactly${component==='themes'?' and return three DISTINCT theme labels':''}.`;
    try{
      const payload=await env.AI.run(model,{
        prompt:promptFor(component)+correction,
        image,
        max_tokens:component==='reactions'?2200:component==='description'?1600:1200,
        temperature:attempt===1?0.1:0,
        response_format:schemaMode?{type:'json_schema',json_schema:schema}:{type:'json_object'}
      });
      const raw=responseValue(payload);
      if(raw==null||raw==='')throw new Error('Workers AI returned no analysis text');
      const parsed=parse(raw);
      if(!Object.prototype.hasOwnProperty.call(parsed,component))throw new Error(`Provider omitted ${component}`);
      return{value:validateComponent(component,parsed[component]),attempts:attempt,mode:schemaMode?'json_schema':'json_object-fallback'};
    }catch(error){
      lastError=error;
      const message=String(error?.message||error);
      if(attempt>=3||(!isTransientProviderError(message)&&!isRecoverableOutputError(message)))break;
      await sleep(150*Math.pow(2,attempt-1));
    }
  }
  const message=String(lastError?.message||lastError||'Unknown provider failure');
  if(/json mode couldn'?t be met/i.test(message))throw new Error(`Vision provider could not satisfy structured ${component} output after retry`);
  throw new Error(message);
}

async function analyze(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const requested=[...new Set((body.components||[]).filter(x=>COMPONENT_IDS.includes(x)))];
  if(!body.imageId||!requested.length)throw new Error('imageId and components are required');
  const image=body.imageDataUrl?dataUrlBytes(body.imageDataUrl):await fetchBytes(body.imageUrl);
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const components={},diagnostics={};
  for(const component of requested){
    try{
      const result=await runComponent(env,model,image,component);
      components[component]=result.value;
      diagnostics[component]={attempts:result.attempts,mode:result.mode};
    }catch(error){
      throw new Error(`${component}: ${String(error?.message||error)}`);
    }
  }
  return{
    schemaVersion:1,
    imageId:body.imageId,
    analyzedAt:new Date().toISOString(),
    provider:{id:'cloudflare-workers-ai',displayName:'Genreactrix Vision · Cloudflare Workers AI',model,workerVersion:API_VERSION,build:BUILD_ID},
    model,
    promptVersions:Object.fromEntries(requested.map(id=>[id,PROMPT_VERSION])),
    components,
    diagnostics
  };
}

export default{
  async fetch(request,env={}){
    const url=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'access-control-max-age':'86400'}});
    if(request.method==='GET'&&url.pathname==='/api/health')return json({
      ok:true,service:'Genreactrix AI',version:API_VERSION,build:BUILD_ID,
      vision:env.AI?'configured':'not-configured',provider:'cloudflare-workers-ai',structuredOutput:'component-json-schema'
    });
    try{
      if(request.method==='POST'&&url.pathname==='/api/genreactrix/analyze'){
        if(!env.ANALYSIS_KEY)return json({ok:false,error:'Analysis access is not configured',workerVersion:API_VERSION},{status:503});
        if(request.headers.get('x-analysis-key')!==env.ANALYSIS_KEY)return json({ok:false,error:'Unauthorized',workerVersion:API_VERSION},{status:401});
        const body=await request.json().catch(()=>null);
        if(!body)return json({ok:false,error:'JSON body required',workerVersion:API_VERSION},{status:400});
        return json({ok:true,result:await analyze(env,body),workerVersion:API_VERSION});
      }
    }catch(error){
      return json({ok:false,error:String(error?.message||error),workerVersion:API_VERSION,build:BUILD_ID},{status:500});
    }
    return json({ok:false,error:'Not found',workerVersion:API_VERSION},{status:404});
  }
};
