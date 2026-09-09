# Premium public E2E failure analysis

Runtime source: `ded08392e2dfea76e4050a234165f5e7b8c4152b`
Deployment: `dpl_A6CvaDHT34auCMFFoNxnmDvCXCBY`
Alias: `https://cadre-ai-chatbot-tawny.vercel.app`

Anonymous marker/API smoke passed after deployment, including health, current Donna/product/composer markers, deterministic greeting, exactly one configured Donna overview follow-up, explicit follow-up opt-out, and pricing/account boundary behavior.

The first full anonymous browser matrix then produced **57/58 PASS**. The only failure was desktop `ambient media is local, muted, bounded, and presentation-only`: the control was visibly labeled `Pause ambient motion`, but clicking it left `.intro-media[data-motion]` at `video` instead of `paused`.

## Reproduced mechanism

`AmbientMedia.toggleMotion()` branches on the native `video.paused` property while the visible control/state branches on React's `paused` state. On a remote cold load, the control can render as `Pause` as soon as motion is allowed while the media element is still natively paused pending autoplay/resource readiness. A click then enters the `element.paused` branch, calls `play()`, and leaves React `paused=false`; the user's Pause action becomes a Play action.

This race is much less likely with local assets and explains why local/CI matrices passed while the deployed desktop cold-load check failed. It is a real control-state defect, not accepted as flaky evidence.

## Smallest repair

Make the control branch on its own application state: when the visible state says motion is active (`paused=false`), clicking must call `pause()` and set `paused=true` even if native autoplay has not started yet. When the visible state says paused, an explicit Play click may call `play()` and clear the state only on success. Add a deterministic browser regression that forces the native media element into `paused=true` while the control still reads Pause, then verifies one click produces application `paused` state rather than starting playback.

Redeploy and rerun all 58 public cases after the repair. The 57/58 failure is retained and must not be rewritten as PASS.
