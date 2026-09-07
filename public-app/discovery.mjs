// Live Spotify catalog search. Mood/energy are search hints, not audio measurements.
const terms={happy:['happy','sunshine','joy','good times','smile'],calm:['calm','peace','quiet','dream','relax'],reflective:['reflection','memories','missing you','lonely','yesterday'],energetic:['dance','party','alive','fire','power']};
const genres={pop:'pop',indie:'indie',soul:'soul',electronic:'electronic'};
export function cleanTrack(t){
 if(!t || !/^[a-zA-Z0-9]{22}$/.test(t.id||'') || typeof t.name!=='string' || !Array.isArray(t.artists) || !t.artists.some(a=>typeof a.name==='string') || t.is_playable===false || t.restrictions)return null;
 return {id:t.id,title:t.name.slice(0,300),artist:t.artists.map(a=>a.name).filter(Boolean).join(', ').slice(0,300),uri:'spotify:track:'+t.id};
}
export function chooseFresh(items,recent=[],random=Math.random){
 const seen=new Set(recent),ids=new Set(),titles=new Set();
 const unique=items.filter(t=>{const key=(t.title+'|'+t.artist).toLowerCase();if(ids.has(t.id)||titles.has(key))return false;ids.add(t.id);titles.add(key);return true;});
 for(let i=unique.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[unique[i],unique[j]]=[unique[j],unique[i]];}
 return unique.filter(t=>!seen.has(t.id)).slice(0,10);
}
export async function discover(api,{mood,energy,genre},recent=[],random=Math.random){
 if(!terms[mood]||!Number.isInteger(energy)||energy<1||energy>5||!(genre==='all'||genres[genre]))throw new Error('Choose a valid mood, energy and sound preference.');
 const words=[...terms[mood]],start=Math.floor(random()*words.length),pool=[];
 // Bounded calls, 10 results per page, with varied search terms and pages.
 for(let i=0;i<8;i++){
  const word=i<5?words[(start+i)%words.length]:(energy<=2?'acoustic':energy>=4?'dance':words[(start+i)%words.length]);
  const q=[word,genre==='all'?'':'genre:'+genres[genre],i<5?(energy<=2?'acoustic':energy>=4?'remix':''):''].filter(Boolean).join(' ');
  const offset=i<5?Math.floor(random()*5)*10:0;
  let response=await api('search?'+new URLSearchParams({q,type:'track',limit:'10',offset:String(offset)}));
  pool.push(...(response.tracks?.items||[]).map(cleanTrack).filter(Boolean));
  const fresh=chooseFresh(pool,recent,random);if(fresh.length===10)return fresh;
 }
 return chooseFresh(pool,recent,random);
}
export function savedTracks(value){
 if(!Array.isArray(value))return [];
 return value.filter(t=>t&&/^[a-zA-Z0-9]{22}$/.test(t.id||'')&&typeof t.title==='string'&&typeof t.artist==='string').slice(0,10).map(t=>({id:t.id,title:t.title.slice(0,300),artist:t.artist.slice(0,300),uri:'spotify:track:'+t.id}));
}
