/** Shared props for the five lesson step views. */
export interface StepProps<S> {
  step: S;
  /** The student finished this step before (they may be reviewing it). */
  done: boolean;
  busy: boolean;
  /** Save the step. Rejects with an ApiError the step can show. */
  onComplete: (body: object) => Promise<void>;
}
