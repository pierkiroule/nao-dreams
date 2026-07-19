import { useEffect, useMemo, useReducer } from "react";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Receive from "../pages/Receive";
import Launch from "../pages/Launch";
import Crossing from "../pages/Crossing";
import Reveal from "../pages/Reveal";
import DreamDepth from "../pages/DreamDepth";
import Pass from "../pages/Pass";
import Confirmation from "../pages/Confirmation";
import Ocean from "../pages/Ocean";
import Account from "../pages/Account";
import { generateDreamBubble } from "../services/dreamService";
import { syncJourney } from "../services/syncService";
import { createProfile } from "../services/profileService";
import {
  clearAppState,
  loadAppState,
  saveAppState,
} from "../services/journeyService";
import { journeyReducer } from "./journeyMachine";
import { getJourneyProgress } from "./progress";
import { EVENTS, STEPS, initialAppState } from "./state";
import { APP_CONFIG } from "../config/app";

const PAGE_COMPONENTS = {
  [STEPS.HOME]: Home,
  [STEPS.RECEIVE]: Receive,
  [STEPS.LAUNCH]: Launch,
  [STEPS.CROSSING]: Crossing,
  [STEPS.REVEAL]: Reveal,
  [STEPS.DREAM_DEPTH]: DreamDepth,
  [STEPS.PASS]: Pass,
  [STEPS.CONFIRMATION]: Confirmation,
  [STEPS.OCEAN]: Ocean,
  [STEPS.ACCOUNT]: Account,
};

export default function App() {
  const [state, dispatch] = useReducer(
    journeyReducer,
    initialAppState,
    (fallbackState) => loadAppState(fallbackState),
  );

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    syncJourney(state.journey, state.profile).catch((error) => {
      console.warn("Impossible de synchroniser le rêve.", error);
    });
  }, [state.journey, state.profile]);

  const actions = useMemo(
    () => ({
      async createProfile(pseudonym) {
        const profile = await createProfile(pseudonym);
        dispatch({ type: EVENTS.CREATE_PROFILE, payload: { profile } });
      },

      openAccount() {
        dispatch({ type: EVENTS.OPEN_ACCOUNT });
      },

      closeAccount() {
        dispatch({ type: EVENTS.CLOSE_ACCOUNT });
      },

      scan() {
        dispatch({
          type: EVENTS.SCAN,
          payload: {
            naoId: APP_CONFIG.defaultNaoId,
            seriesId: APP_CONFIG.defaultSeriesId,
          },
        });
      },

      embark() {
        dispatch({ type: EVENTS.EMBARK });
      },

      async launch(selections) {
        const dream = await generateDreamBubble(selections);

        dispatch({
          type: EVENTS.START_CROSSING,
          payload: {
            selections,
            dream,
          },
        });
      },

      finishCrossing() {
        dispatch({ type: EVENTS.FINISH_CROSSING });
      },

      openDreamDepth() {
        dispatch({ type: EVENTS.OPEN_DREAM_DEPTH });
      },

      continueToPass() {
        dispatch({ type: EVENTS.CONTINUE_TO_PASS });
      },

      confirmPass() {
        dispatch({ type: EVENTS.CONFIRM_PASS });
      },

      openOcean() {
        dispatch({ type: EVENTS.OPEN_OCEAN });
      },

      restart() {
        clearAppState();
        dispatch({ type: EVENTS.RESTART });
      },
    }),
    [],
  );

  const CurrentPage = PAGE_COMPONENTS[state.step] ?? Home;
  const progress = getJourneyProgress(state.step);

  return (
    <Layout progress={progress}>
      <CurrentPage
        state={state}
        journey={state.journey}
        profile={state.profile}
        actions={actions}
      />
    </Layout>
  );
}
