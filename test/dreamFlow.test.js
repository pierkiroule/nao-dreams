import assert from "node:assert/strict";
import test from "node:test";
import { futureDream, riddlesForPasser } from "../src/data/futureDream.js";
import { createSeededJourney } from "../src/services/localDreamRepository.js";
import { generateLocalDream } from "../src/utils/generateLocalDream.js";

test("every journey starts from a hidden future dream seed",()=>{const data=createSeededJourney();assert.equal(data.journey.contributionCount,0);assert.equal(data.journey.revealThreshold,5);assert.equal(data.seed.isSeed,true);assert.equal(data.journey.seed.title,futureDream.title);});
test("each passer receives a different deterministic pair of riddles",()=>{assert.notDeepEqual(riddlesForPasser(0),riddlesForPasser(1));assert.equal(riddlesForPasser(3).length,2);});
test("the echo is generated from the five passers interpretations",()=>{const dream=generateLocalDream([{answers:[{symbol:"🌊"},{symbol:"🚪"}]},{answers:[{symbol:"🌙"}]}],futureDream);assert.equal(dream.original.title,futureDream.title);assert.match(dream.echo.text,/🌊/);assert.match(dream.echo.text,/🚪/);});
