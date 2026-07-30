import test from "node:test";
import assert from "node:assert/strict";
import { DREAM_DRAFTS_KEY, LOCAL_DATA_VERSION, STORAGE_VERSION_KEY, migrateLocalStorage, resetNaoTestData } from "../src/lib/localData.js";

function fakeStorage(entries={}) {
  const values=new Map(Object.entries(entries));
  return { getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key),values };
}

test("la migration supprime seulement les anciennes clés NAO et passe en version 2",async()=>{
  const storage=fakeStorage({"nao-discoveries":"legacy","another-application":"keep"});
  globalThis.localStorage=storage;
  await migrateLocalStorage();
  assert.equal(storage.getItem("nao-discoveries"),null);
  assert.equal(storage.getItem("another-application"),"keep");
  assert.equal(storage.getItem(STORAGE_VERSION_KEY),String(LOCAL_DATA_VERSION));
});

test("la migration est idempotente",async()=>{
  const storage=fakeStorage();globalThis.localStorage=storage;
  await migrateLocalStorage();storage.setItem("nao-discoveries","créé après migration");await migrateLocalStorage();
  assert.equal(storage.getItem("nao-discoveries"),"créé après migration");
});

test("la réinitialisation conserve la session et les données externes",async()=>{
  const storage=fakeStorage({[DREAM_DRAFTS_KEY]:"[]","nao-supabase-session":"session","external":"value"});globalThis.localStorage=storage;
  await resetNaoTestData();
  assert.equal(storage.getItem(DREAM_DRAFTS_KEY),null);
  assert.equal(storage.getItem("nao-supabase-session"),"session");
  assert.equal(storage.getItem("external"),"value");
});
