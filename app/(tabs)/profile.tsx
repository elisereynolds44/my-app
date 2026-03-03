import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";

export default function ProfileTab() {
  const [name, setName] = useState("Guest");
  const [school, setSchool] = useState("Westmont College");
  const [knowledgeLevel, setKnowledgeLevel] = useState("Beginner");
  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        const storedSchool = await AsyncStorage.getItem("userSchool");
        const storedLevel = await AsyncStorage.getItem("userLevel");
        const storedLessons = await AsyncStorage.getItem("lessonsCompleted");

        if (storedName) setName(storedName);
        if (storedSchool) setSchool(storedSchool);
        if (storedLevel) setKnowledgeLevel(storedLevel);

        if (storedLessons !== null) {
          const parsed = Number(storedLessons);
          setLessonsCompleted(Number.isNaN(parsed) ? 0 : parsed);
        }
      } catch (error) {
        console.log("Error loading profile data:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>School</Text>
        <Text style={styles.value}>{school}</Text>

        <Text style={styles.label}>Knowledge Level</Text>
        <Text style={styles.value}>{knowledgeLevel}</Text>

        <Text style={styles.label}>Lessons Completed</Text>
        <Text style={styles.value}>{lessonsCompleted}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(onboarding)/profile")}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Edit setup</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Alpha build · Local demo data</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    padding: 20,
  },
  title: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
  },
  label: {
    color: MUTED,
    fontSize: 12,
    marginTop: 12,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  value: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 16,
  },
  footer: {
    color: MUTED,
    fontSize: 12,
    marginTop: 16,
  },
});