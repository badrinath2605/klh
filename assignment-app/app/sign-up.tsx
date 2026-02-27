import {
    ClerkLoaded,
    ClerkLoading,
    useOAuth,
    useSignUp,
} from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // 1: Email + Password Sign Up
  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      console.error("Sign-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Email OTP
  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGN-UP / SIGN-IN
  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Google sign-up error:", err);
    }
  };

  return (
    <>
      <ClerkLoading>
        <ActivityIndicator size="large" />
      </ClerkLoading>

      <ClerkLoaded>
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
          {!pendingVerification ? (
            <>
              <Text style={{ fontSize: 22, marginBottom: 20 }}>
                Create Account
              </Text>

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
                onPress={onSignUpPress}
                disabled={loading}
                style={{
                  backgroundColor: "#2563eb",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onGooglePress}
                style={{
                  backgroundColor: "#000",
                  padding: 12,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 22, marginBottom: 20 }}>
                Verify Email
              </Text>

              <Text style={{ marginBottom: 10 }}>
                Enter the verification code sent to your email
              </Text>

              <TextInput
                placeholder="Verification Code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
              />

              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={loading}
                style={{
                  backgroundColor: "#16a34a",
                  padding: 12,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  {loading ? "Verifying..." : "Verify"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ClerkLoaded>
    </>
  );
}
