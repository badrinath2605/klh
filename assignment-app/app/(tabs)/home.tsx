import InfoRow from "@/components/InfoRow";
import Loading from "@/components/Loading";
import ScoreCards from "@/components/ScoreCards";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { apiGet } = useApi();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiGet("/me").then(setData).catch(console.error);
  }, []);

  if (!data) return <Loading />;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Credit Overview</Text>

      <ScoreCards score={data.score} status={data.status} />

      <InfoRow label="Assigned Event" value={data.eventName} />
      <InfoRow label="Role" value={data.role} />
      <InfoRow label="Risk Tier" value={data.riskTier} />
    </View>
  );
}
