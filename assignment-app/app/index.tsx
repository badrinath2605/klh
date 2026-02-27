import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return null;
  }

  // User not authenticated → Sign In
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  // User authenticated → Home tab
  return <Redirect href="/home" />;
}
