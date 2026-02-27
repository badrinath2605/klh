import { Text, View } from "react-native";

export default function ScoreCards({ score, status }: any) {
  return (
    <View
      style={{
        marginTop: 16,
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#111",
      }}
    >
      <Text style={{ color: "#aaa" }}>Credit Score</Text>
      <Text style={{ color: "#fff", fontSize: 36 }}>{score}</Text>
      <Text style={{ color: "#0f0" }}>{status}</Text>
    </View>
  );
}
