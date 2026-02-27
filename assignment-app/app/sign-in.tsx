import {
  ClerkLoaded,
  ClerkLoading,
  useOAuth,
  useSignIn,
} from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();


  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // EMAIL + PASSWORD SIGN IN
  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      const attempt = await signIn.create({
        identifier: email,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message || "Sign-in failed. Try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGN IN
  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  return (
    <>
      <ClerkLoading>
        <ActivityIndicator size="large" />
      </ClerkLoading>

      <ClerkLoaded>
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 22, marginBottom: 20 }}>Sign In</Text>

          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
          />

          <TouchableOpacity
            onPress={onSignInPress}
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {loading ? "Signing in..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGooglePress}
            style={{
              backgroundColor: "#000",
              padding: 12,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Link href="/sign-up">
            <Text style={{ textAlign: "center" }}>
              Create an account
            </Text>
          </Link>
        </View>
      </ClerkLoaded>
    </>
  );
}
