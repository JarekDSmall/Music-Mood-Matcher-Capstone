// Subjective editorial tags, not Spotify audio-feature measurements.
const entries = [
 ['Lovely Day','Bill Withers','happy','soul',2],['September','Earth, Wind & Fire','happy','soul',5],['Put Your Records On','Corinne Bailey Rae','happy','soul',2],['Good as Hell','Lizzo','happy','pop',5],['Walking on a Dream','Empire of the Sun','happy','electronic',4],['Sunday Best','Surfaces','happy','pop',3],['Dog Days Are Over','Florence + The Machine','happy','indie',5],['Here Comes the Sun','The Beatles','happy','indie',2],
 ['A Walk','Tycho','calm','electronic',3],['Weightless','Marconi Union','calm','electronic',1],['Holocene','Bon Iver','calm','indie',2],['Banana Pancakes','Jack Johnson','calm','indie',2],['Come Away With Me','Norah Jones','calm','soul',1],['Pink + White','Frank Ocean','calm','soul',3],['Bloom','The Paper Kites','calm','indie',1],['Sunset Lover','Petit Biscuit','calm','electronic',3],
 ['The Night We Met','Lord Huron','reflective','indie',1],['Skinny Love','Bon Iver','reflective','indie',2],['Someone Like You','Adele','reflective','pop',2],['Fast Car','Tracy Chapman','reflective','indie',3],['River','Leon Bridges','reflective','soul',2],['Liability','Lorde','reflective','pop',1],['Retrograde','James Blake','reflective','electronic',3],['Both Sides Now','Joni Mitchell','reflective','indie',1],
 ['Harder, Better, Faster, Stronger','Daft Punk','energetic','electronic',5],['Electric Feel','MGMT','energetic','indie',4],['Levitating','Dua Lipa','energetic','pop',4],['Blinding Lights','The Weeknd','energetic','pop',5],['Feel Good Inc.','Gorillaz','energetic','indie',4],['Higher Ground','Stevie Wonder','energetic','soul',5],['Midnight City','M83','energetic','electronic',5],['Tightrope','Janelle Monáe','energetic','soul',4]
];
export const catalog = entries.map(([title,artist,mood,genre,energy],id)=>({id:`track-${id+1}`,title,artist,mood,genre,energy}));
export const moods={happy:'A brighter outlook',calm:'Room to breathe',reflective:'Sit with the feeling',energetic:'Find your momentum'};
export function matchTracks(mood,energy,genre='all') {
 if(!Object.hasOwn(moods,mood)||!Number.isInteger(energy)||energy<1||energy>5||!['all','pop','indie','soul','electronic'].includes(genre))throw new Error('Invalid mood, energy, or genre.');
 return catalog.filter(t=>t.mood===mood&&(genre==='all'||t.genre===genre)).sort((a,b)=>Math.abs(a.energy-energy)-Math.abs(b.energy-energy)||a.id.localeCompare(b.id)).slice(0,6);
}
export function normalize(value){return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
export function exactSpotifyMatch(track,items){return items.find(item=>item.uri?.startsWith('spotify:track:')&&normalize(item.name)===normalize(track.title)&&item.artists?.some(a=>normalize(a.name)===normalize(track.artist)))||null;}
export function validateSaved(value){if(!Array.isArray(value))return [];return value.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'&&Array.isArray(p.trackIds)&&p.trackIds.every(id=>catalog.some(t=>t.id===id))).slice(0,20).map(p=>({...p,name:p.name.slice(0,80)}));}
