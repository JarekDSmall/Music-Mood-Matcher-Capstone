export const CLIENT_ID='d21caa63f0dd4557a6ad086bce121c39'; // Public OAuth identifier; never a client secret.
export const REDIRECT_URI='https://jareksmall.com/music-mood-matcher/';
const TOKEN_KEY='mmm.spotify.session.v1', FLOW_KEY='mmm.spotify.flow.v1';
function read(key){try{return JSON.parse(sessionStorage.getItem(key));}catch{return null;}}
export function disconnect(){sessionStorage.removeItem(TOKEN_KEY);sessionStorage.removeItem(FLOW_KEY);}
export function connected(){const s=read(TOKEN_KEY);return !!(s?.token&&s.expires>Date.now()+30000);}
function random(){const bytes=crypto.getRandomValues(new Uint8Array(48));return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');}
export async function connect(){
 if(location.origin!=='https://jareksmall.com')throw new Error('Connect Spotify from jareksmall.com/music-mood-matcher/.');
 const verifier=random(),state=random();const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier));
 const challenge=btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
 sessionStorage.setItem(FLOW_KEY,JSON.stringify({verifier,state,created:Date.now()}));
 const params=new URLSearchParams({client_id:CLIENT_ID,response_type:'code',redirect_uri:REDIRECT_URI,code_challenge_method:'S256',code_challenge:challenge,state,scope:'playlist-modify-private'});
 location.assign('https://accounts.spotify.com/authorize?'+params);
}
export async function finishAuthorization(){
 const params=new URLSearchParams(location.search);if(!params.has('code')&&!params.has('error'))return false;
 const flow=read(FLOW_KEY);sessionStorage.removeItem(FLOW_KEY);history.replaceState({},'',location.pathname);
 if(!flow||params.get('state')!==flow.state||Date.now()-flow.created>600000)throw new Error('Spotify sign-in expired or could not be verified. Please connect again.');
 if(params.has('error'))throw new Error('Spotify connection was canceled. Your public playlist is still available.');
 const response=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:CLIENT_ID,grant_type:'authorization_code',code:params.get('code'),redirect_uri:REDIRECT_URI,code_verifier:flow.verifier})});
 if(!response.ok)throw new Error('Spotify could not complete sign-in. Try connecting again.');
 const data=await response.json();if(typeof data.access_token!=='string'||!Number.isFinite(data.expires_in))throw new Error('Spotify returned an invalid session.');
 sessionStorage.setItem(TOKEN_KEY,JSON.stringify({token:data.access_token,expires:Date.now()+data.expires_in*1000}));return true;
}
export async function api(path,options={}){
 if(!connected()){disconnect();throw new Error('Your Spotify session has expired. Connect again.');}
 const session=read(TOKEN_KEY);const response=await fetch('https://api.spotify.com/v1/'+path,{...options,headers:{Authorization:`Bearer ${session.token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(20000)});
 if(response.status===401){disconnect();throw new Error('Spotify sign-in expired. Connect again.');}
 if(response.status===403)throw new Error('Spotify denied API access. This app only works with allowlisted Spotify test accounts, and some features may be restricted. Connect with an approved account to search Spotify.');
 if(response.status===429)throw new Error('Spotify’s request limit was reached. Please try later.');
 if(!response.ok)throw new Error(`Spotify could not complete this request (${response.status}). Please try later.`);
 return response.status===204?null:response.json();
}
