import {catalog,moods,matchTracks,exactSpotifyMatch,validateSaved} from './catalog.mjs';
import * as spotify from './spotify.mjs';
const $=id=>document.getElementById(id), KEY='mmm.playlists.v1', DRAFT='mmm.draft.v1';
let tracks=[],saved=[],resolved=[],busy=false,createdPlaylist=null;
const names=['','Very gentle','Easygoing','Balanced','Upbeat','High energy'];
function message(text){$('status').textContent=text;}
function spotifyMessage(text){$('spotify-status').textContent=text;}
function node(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function selection(){return {mood:document.querySelector('input[name=mood]:checked').value,energy:Number($('energy').value),genre:$('genre').value};}
function saveDraft(){try{sessionStorage.setItem(DRAFT,JSON.stringify({trackIds:tracks.map(t=>t.id),name:$('playlist-name').value,...selection()}));}catch{}}
function invalidateReview(){resolved=[];createdPlaylist=null;$('spotify-review').hidden=true;$('spotify-result').hidden=true;}
function setBusy(value){busy=value;for(const id of ['prepare','export','connect','disconnect'])$(id).disabled=value;}
function updateConnection(){const ok=spotify.connected();$('connect').hidden=ok;$('disconnect').hidden=!ok;$('prepare').hidden=!ok;}
function render(){
 $('tracks').replaceChildren();tracks.forEach((track,index)=>{
  const row=node('li',undefined,'track');row.append(node('span',String(index+1).padStart(2,'0'),'track-number'));
  const info=node('div');info.append(node('div',track.title,'track-title'),node('div',track.artist,'track-artist'));row.append(info);
  const actions=node('div',undefined,'track-tools'),link=node('a','Open in Spotify ↗');link.href='https://open.spotify.com/search/'+encodeURIComponent(track.title+' '+track.artist);link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`Find ${track.title} by ${track.artist} on Spotify`);
  const remove=node('button','×','remove');remove.setAttribute('aria-label',`Remove ${track.title}`);remove.addEventListener('click',()=>{tracks=tracks.filter(t=>t.id!==track.id);invalidateReview();render();message(`${track.title} removed.`);});actions.append(link,remove);row.append(actions);$('tracks').append(row);
 });
 $('track-count').textContent=`${tracks.length} track${tracks.length===1?'':'s'}`;$('empty').hidden=!!tracks.length;
 for(const id of ['save','shuffle','copy','download'])$(id).disabled=!tracks.length;
 saveDraft();
}
function generate(){const {mood,energy,genre}=selection();tracks=matchTracks(mood,energy,genre);$('playlist-heading').textContent=moods[mood];$('playlist-name').value=moods[mood];$('match-description').textContent=`${names[energy]} picks, ordered by closeness to your energy preference. ${genre==='all'?'A mix of sounds.':'Filtered to your sound preference.'}`;invalidateReview();render();message(tracks.length?`${tracks.length} tracks matched. Remove any you don’t want, then save your playlist.`:'No tracks match this combination yet. Try “A bit of everything” or another mood.');}
function readSaved(){try{saved=validateSaved(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch{saved=[];}}
function persistSaved(next){try{localStorage.setItem(KEY,JSON.stringify(next));saved=next;renderSaved();return true;}catch{message('Browser storage is unavailable or full. Download your track list instead.');return false;}}
function renderSaved(){
 $('saved').replaceChildren();if(!saved.length){$('saved').append(node('p','Your collection starts with your first save.','caption'));return;}
 saved.forEach(p=>{const row=node('div',undefined,'saved-item'),info=node('div');info.append(node('div',p.name,'saved-name'),node('small',`${p.trackIds.length} tracks`));const actions=node('div',undefined,'saved-actions');
 const load=node('button','Load','quiet');load.setAttribute('aria-label',`Load ${p.name}`);load.onclick=()=>{tracks=p.trackIds.map(id=>catalog.find(t=>t.id===id)).filter(Boolean);$('playlist-name').value=p.name;$('playlist-heading').textContent=p.name;$('match-description').textContent='From your saved collection.';invalidateReview();render();message(`Loaded ${p.name}.`);};
 const remove=node('button','Delete','quiet');remove.setAttribute('aria-label',`Delete saved playlist ${p.name}`);remove.onclick=()=>{if(persistSaved(saved.filter(item=>item.id!==p.id)))message(`Deleted ${p.name} from this device.`);};actions.append(load,remove);row.append(info,actions);$('saved').append(row);});
}
function trackText(){return `${$('playlist-name').value.trim()||'My mood playlist'}\nMusic Mood Matcher — jareksmall.com\n\n`+tracks.map((t,i)=>`${i+1}. ${t.title} — ${t.artist}`).join('\n');}
$('match').onclick=generate;$('reset').onclick=generate;
$('energy').oninput=()=>{$('energy-value').textContent=names[Number($('energy').value)];};
$('shuffle').onclick=()=>{for(let i=tracks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tracks[i],tracks[j]]=[tracks[j],tracks[i]];}invalidateReview();render();message('Track order shuffled.');};
$('playlist-name').oninput=()=>{invalidateReview();saveDraft();};
$('save').onclick=()=>{if(!tracks.length)return;const name=$('playlist-name').value.trim()||'My mood playlist';if(saved.length>=20){message('You have 20 saved playlists. Delete one before saving another.');return;}if(persistSaved([{id:crypto.randomUUID(),name,trackIds:tracks.map(t=>t.id)},...saved]))message(`Saved ${name} on this device.`);};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([trackText()],{type:'text/plain;charset=utf-8'}));const a=node('a');a.href=url;a.download='music-mood-matcher-playlist.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Track list downloaded.');};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(trackText());message('Track list copied.');}catch{message('Clipboard access is unavailable. Use Download track list instead.');}};
$('connect').onclick=async()=>{try{saveDraft();await spotify.connect();}catch(e){spotifyMessage(e.message);}};
$('disconnect').onclick=()=>{spotify.disconnect();invalidateReview();updateConnection();spotifyMessage('Disconnected. Your saved playlists remain on this device.');};
$('prepare').onclick=async()=>{
 if(busy)return;if(!tracks.length){spotifyMessage('Choose some tracks first.');return;}
 setBusy(true);invalidateReview();const batch=[...tracks];spotifyMessage('Looking for exact title and artist matches on Spotify…');
 try{
  const matches=[];for(const t of batch){const q=`track:${t.title} artist:${t.artist}`;const result=await spotify.api('search?'+new URLSearchParams({q,type:'track',limit:'5'}));matches.push({track:t,match:exactSpotifyMatch(t,result.tracks?.items||[])});}
  // Discard a response if the visitor changed the track list during the request.
  if(batch.map(t=>t.id).join()!==tracks.map(t=>t.id).join()){spotifyMessage('Your playlist changed. Find Spotify matches again.');return;}
  resolved=matches;$('matched-tracks').replaceChildren();let found=0;
  matches.forEach(({track,match},i)=>{const label=node('label',undefined,'match-check'),input=node('input');input.type='checkbox';input.checked=!!match;input.disabled=!match;input.dataset.index=String(i);const text=node('span',`${track.title} — ${track.artist}`);text.append(node('small',match?' · Matched':' · Not found; will be skipped'));label.append(input,text);$('matched-tracks').append(label);if(match)found++;});
  $('spotify-review').hidden=false;$('export').hidden=!found;spotifyMessage(`${found} of ${matches.length} tracks matched. Review them before creating a private playlist.`);
 }catch(e){spotifyMessage(e.message);updateConnection();}finally{setBusy(false);}
};
$('export').onclick=async()=>{
 if(busy)return;const uris=[...$('matched-tracks').querySelectorAll('input:checked')].map(n=>resolved[Number(n.dataset.index)]?.match?.uri).filter(Boolean);if(!uris.length){spotifyMessage('Select at least one matched track.');return;}
 setBusy(true);spotifyMessage('Creating your private Spotify playlist…');
 try{
  const playlist=await spotify.api('me/playlists',{method:'POST',body:JSON.stringify({name:$('playlist-name').value.trim()||'My mood playlist',public:false,description:'Editorial mood picks from Music Mood Matcher by Jarek Small.'})});
  createdPlaylist=playlist;const safeId=/^[a-zA-Z0-9]+$/.test(playlist.id||'')?playlist.id:null;if(!safeId)throw new Error('Spotify returned an invalid playlist ID.');
  $('spotify-result').href='https://open.spotify.com/playlist/'+safeId;$('spotify-result').hidden=false;
  await spotify.api(`playlists/${safeId}/items`,{method:'POST',body:JSON.stringify({uris})});
  spotifyMessage(`Created a private playlist with ${uris.length} tracks.`);$('spotify-review').hidden=true;
 }catch(e){spotifyMessage(createdPlaylist?'Spotify created the playlist, but adding tracks failed. Open the playlist below to review it. '+e.message:e.message);if(createdPlaylist)$('spotify-review').hidden=true;updateConnection();}finally{setBusy(false);}
};
let returnDraft=null;try{returnDraft=sessionStorage.getItem(DRAFT);}catch{}
readSaved();renderSaved();generate();
try{const draft=JSON.parse(returnDraft||'null');if(draft&&Array.isArray(draft.trackIds)&&new URLSearchParams(location.search).has('code')){tracks=draft.trackIds.map(id=>catalog.find(t=>t.id===id)).filter(Boolean);$('playlist-name').value=String(draft.name||'My mood playlist').slice(0,80);render();}}catch{}
updateConnection();spotify.finishAuthorization().then(done=>{updateConnection();if(done)spotifyMessage('Spotify connected. You can now find matches for your track list.');}).catch(e=>{spotifyMessage(e.message);updateConnection();});
