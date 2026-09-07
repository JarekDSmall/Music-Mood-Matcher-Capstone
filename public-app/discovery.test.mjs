import test from 'node:test';
import assert from 'node:assert/strict';
import {discover,chooseFresh,cleanTrack,savedTracks} from './discovery.mjs';
const track=i=>({id:String(i).padStart(22,'0'),name:'Song '+i,artists:[{name:'Artist '+i}]});
test('live discovery returns ten unique fresh Spotify tracks and respects search limits',async()=>{
 const calls=[];const api=async path=>{calls.push(path);const p=new URLSearchParams(path.split('?')[1]);assert.equal(p.get('limit'),'10');return {tracks:{items:Array.from({length:10},(_,i)=>track(i+calls.length*10))}}};
 const result=await discover(api,{mood:'happy',energy:3,genre:'pop'},[track(10).id],()=>0.2);
 assert.equal(result.length,10);assert(!result.some(t=>t.id===track(10).id));assert(calls.every(p=>p.includes('genre%3Apop')));
});
test('recent and duplicate recordings are excluded rather than recycled to fill ten',()=>{
 const items=[track(1),track(1),track(2)].map(cleanTrack);assert.deepEqual(chooseFresh(items,[track(1).id]).map(t=>t.id),[track(2).id]);
});
test('empty catalog is bounded and never falls back to static songs',async()=>{let calls=0;const result=await discover(async()=>{calls++;return {tracks:{items:[]}}},{mood:'calm',energy:1,genre:'all'});assert.equal(calls,8);assert.deepEqual(result,[]);});
test('access and rate errors propagate without retry storm',async()=>{let calls=0;await assert.rejects(discover(async()=>{calls++;throw new Error('429');},{mood:'happy',energy:3,genre:'all'}),/429/);assert.equal(calls,1);});
test('unplayable results and corrupt saved tracks are rejected',()=>{assert.equal(cleanTrack({...track(1),is_playable:false}),null);assert.equal(cleanTrack({...track(1),id:'javascript:bad'}),null);assert.deepEqual(savedTracks([{id:'bad',title:'x',artist:'y'}]),[]);assert.equal(savedTracks([cleanTrack(track(1))])[0].uri,'spotify:track:'+track(1).id);});
