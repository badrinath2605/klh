import { useAuth, useUser } from "@clerk/clerk-expo";
import { Button, Text, View } from "react-native";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18 }}>{user?.fullName}</Text>
      <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
