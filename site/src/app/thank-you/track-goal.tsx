"use client";

import { useEffect } from "react";
import { trackGoal } from "fathom-client";

const CHECKLIST_SIGNUP_GOAL_ID = "8N4QZXND";

export function TrackChecklistSignup() {
  useEffect(() => {
    trackGoal(CHECKLIST_SIGNUP_GOAL_ID, 0);
  }, []);

  return null;
}
